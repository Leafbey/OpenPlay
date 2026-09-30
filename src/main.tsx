import React, { createContext, useContext, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Boxes, CalendarDays, ChevronDown, Gamepad2, Layers3, Library, Maximize2,
  Minus, MonitorDown, Plus, Search, Settings, Square, X
} from 'lucide-react';
import './styles.css';

type Game = {
  id: string; title: string; source: 'Steam'|'Epic Games'|'Local Games';
  installed: boolean; firstPlayed?: string; lastPlayed?: string; timePlayed?: string;
  developer?: string; publisher?: string; releaseDate?: string; genre?: string; installFolder?: string;
  cover: string; banner: string; description: string;
};

const art=(seed:string,w=800,h=450)=>`https://picsum.photos/seed/${encodeURIComponent(seed)}/${w}/${h}`;

const games: Game[] = [
  {id:'elden-ring',title:'Elden Ring',source:'Steam',installed:true,firstPlayed:'Feb 25, 2022',lastPlayed:'Yesterday',timePlayed:'128 hours',developer:'FromSoftware',publisher:'Bandai Namco Entertainment',releaseDate:'February 25, 2022',genre:'Action RPG',installFolder:'D:\\SteamLibrary\\steamapps\\common\\ELDEN RING',cover:art('elden-ring-cover',520,760),banner:art('elden-ring-banner',1400,390),description:`Rise, Tarnished, and be guided by grace to brandish the power of the Elden Ring and become an Elden Lord.

Elden Ring is a vast and immersive fantasy action RPG from acclaimed developer FromSoftware. Set in an expansive world filled with mystery, danger, and discovery, the game invites you to explore freely and forge your own path.

The once-golden Elden Ring has been shattered. Powerful demigods rule over the remnants, each with their own ambitions and twisted visions. As a Tarnished, you must traverse this broken world, confront formidable beings, and decide your own destiny.

Explore a seamless open world filled with sprawling landscapes, towering castles, hidden dungeons, and forgotten ruins. Every corner holds secrets, powerful enemies, and valuable rewards.

Elden Ring offers deep character customisation with a wide variety of weapons, magic, skills and armour. Experiment, adapt, and build a playstyle that is your own.`},
  ...['Baldur’s Gate 3','Cyberpunk 2077','The Witcher 3: Wild Hunt','Minecraft','Red Dead Redemption 2','Terraria','Hades','Hollow Knight','Stardew Valley','God of War','Monster Hunter: World','Persona 5 Royal','The Elder Scrolls V: Skyrim','Fallout 4','Grand Theft Auto V','Forza Horizon 5','Palworld'].map((title,i)=>({
    id:`game-${i}`,title,source:(i%6===4?'Epic Games':i%5===3?'Local Games':'Steam') as Game['source'],
    installed:i%4!==1,cover:art(title+' cover',220,300),banner:art(title+' banner',1200,360),
    description:`${title} is part of your OpenPlay library. Game metadata and descriptions will come from the shared OpenPlay game database as platform integrations are added.`
  }))
];

type AppState={selected:Game; setSelected:(g:Game)=>void; filter:'all'|'installed'|'not'; setFilter:(v:'all'|'installed'|'not')=>void};
const Ctx=createContext<AppState|null>(null);
const useApp=()=>{const c=useContext(Ctx);if(!c)throw new Error('Missing OpenPlay context');return c};

function Widget({title,children,className=''}:{title?:string;children:React.ReactNode;className?:string}) {
  return <section className={`widget ${className}`}>{title&&<div className="widget-title">{title}</div>}{children}</section>
}

function Sidebar(){
  const [active,setActive]=useState('Library');
  return <aside className="sidebar">
    <div className="brand"><span className="brand-mark"><Gamepad2 size={20}/></span><b>OpenPlay</b></div>
    <nav>
      {[[Library,'Library'],[Layers3,'Collections'],[Settings,'Settings']].map(([Icon,label]:any)=><button key={label} className={active===label?'nav active':'nav'} onClick={()=>setActive(label)}><Icon size={20}/>{label}</button>)}
    </nav>
    <div className="divider"/>
    <div className="platform-head"><span>PLATFORMS</span><Plus size={18}/></div>
    {[[MonitorDown,'Steam'],[Boxes,'Epic Games'],[Gamepad2,'Local Games']].map(([Icon,label]:any)=><button key={label} className="nav"><Icon size={20}/>{label}</button>)}
  </aside>
}

function Topbar(){
  return <header className="topbar">
    <label className="global-search"><Search size={20}/><input placeholder="Search games..."/></label>
    <div className="top-actions">
      <button><Plus size={18}/>Add Widget</button><button>Edit Layout</button>
      <button>Default (Basic)<ChevronDown size={16}/></button>
      <span className="window"><Minus/><Square size={16}/><X/></span>
    </div>
  </header>
}

function GameLibrary(){
  const {selected,setSelected,filter,setFilter}=useApp();
  const shown=games.filter(g=>filter==='all'||(filter==='installed'?g.installed:!g.installed));
  return <Widget className="game-library">
    <div className="filters">
      <button className={filter==='all'?'selected':''} onClick={()=>setFilter('all')}>All Games</button>
      <button className={filter==='installed'?'selected':''} onClick={()=>setFilter('installed')}>Installed</button>
      <button className={filter==='not'?'selected':''} onClick={()=>setFilter('not')}>Not Installed</button>
    </div>
    <div className="game-list">{shown.map(g=><button className={selected.id===g.id?'game-row selected':''} key={g.id} onClick={()=>setSelected(g)}>
      <img src={g.cover}/><span>{g.title}</span><small>{g.source==='Steam'?'S':g.source==='Epic Games'?'E':'L'}</small>
    </button>)}</div>
  </Widget>
}

function Banner(){const {selected}=useApp();return <Widget className="banner"><img src={selected.banner} alt=""/></Widget>}
function PlayButton(){const {selected}=useApp();return <Widget className="play-wrap"><button className="play"><span>▶</span>Play</button><span className="launch-note">{selected.installed?'Ready to play':'Not installed'}</span></Widget>}
function Stats(){const {selected:g}=useApp();return <Widget className="stats" title="Play Statistics">
  <div className="stat"><CalendarDays/><span><small>First Played</small><b>{g.firstPlayed||'—'}</b></span></div>
  <div className="stat"><span className="clock">◷</span><span><small>Last Played</small><b>{g.lastPlayed||'—'}</b></span></div>
  <div className="stat"><span className="clock">◷</span><span><small>Time Played</small><b>{g.timePlayed||'—'}</b></span></div>
</Widget>}
function Cover(){const {selected}=useApp();return <Widget title="Game Cover" className="cover"><img src={selected.cover} alt=""/></Widget>}
function Info(){const {selected:g}=useApp();const rows=[['Developer',g.developer],['Publisher',g.publisher],['Release Date',g.releaseDate],['Genre',g.genre],['Library',g.source],['Installation Folder',g.installFolder]];return <Widget title="Game Information" className="info">{rows.map(([k,v])=><div className="info-row" key={k}><span>{k}</span><b>{v||'—'}</b></div>)}</Widget>}
function Description(){const {selected}=useApp();return <Widget title="Game Description" className="description"><div className="description-scroll">{selected.description.split('\n\n').map((p,i)=><p key={i}>{p}</p>)}</div></Widget>}

function App(){
  const [selected,setSelected]=useState(games[0]);
  const [filter,setFilter]=useState<AppState['filter']>('all');
  const value=useMemo(()=>({selected,setSelected,filter,setFilter}),[selected,filter]);
  return <Ctx.Provider value={value}><div className="app"><Sidebar/><Topbar/><main className="workspace">
    <GameLibrary/>
    <div className="detail">
      <Banner/>
      <div className="action-row"><PlayButton/><Stats/></div>
      <div className="lower"><div className="left-stack"><Cover/><Info/></div><Description/></div>
    </div>
  </main></div></Ctx.Provider>
}

createRoot(document.getElementById('root')!).render(<React.StrictMode><App/></React.StrictMode>);
