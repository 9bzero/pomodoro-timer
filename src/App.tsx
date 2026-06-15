import{useState,useEffect,useCallback}from'react'
  type Mode='work'|'short'|'long'
  const MODES:{[k in Mode]:{label:string;duration:number;color:string}}={
    work:{label:'Focus',duration:25*60,color:'#ef4444'},
    short:{label:'Short Break',duration:5*60,color:'#22c55e'},
    long:{label:'Long Break',duration:15*60,color:'#3b82f6'}
  }
  export default function App(){
    const[mode,setMode]=useState<Mode>('work')
    const[time,setTime]=useState(MODES.work.duration)
    const[running,setRunning]=useState(false)
    const[sessions,setSessions]=useState(0)
    const[total,setTotal]=useState(0)
    const cfg=MODES[mode]
    const switchMode=(m:Mode)=>{setMode(m);setTime(MODES[m].duration);setRunning(false)}
    useEffect(()=>{if(!running)return;const id=setInterval(()=>{setTime(t=>{if(t<=1){setRunning(false);if(mode==='work'){setSessions(s=>s+1);setTotal(tot=>tot+MODES.work.duration)}return MODES[mode].duration}return t-1})},1000);return()=>clearInterval(id)},[running,mode])
    const fmt=(s:number)=>`${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`
    const pct=((cfg.duration-time)/cfg.duration)*100
    const r=80,circ=2*Math.PI*r
    return(
      <div style={{minHeight:'100vh',background:'#0f172a',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',fontFamily:'Inter,system-ui,sans-serif',color:'#e2e8f0',gap:'2rem'}}>
        <h1 style={{fontWeight:800,fontSize:'1.75rem',color:'#f8fafc',letterSpacing:'-0.5px'}}>🍅 Pomodoro Timer</h1>
        <div style={{display:'flex',gap:'0.75rem'}}>
          {(Object.keys(MODES) as Mode[]).map(m=><button key={m} onClick={()=>switchMode(m)} style={{padding:'0.5rem 1.2rem',background:mode===m?cfg.color:'#1e293b',color:mode===m?'#fff':'#94a3b8',border:'none',borderRadius:20,cursor:'pointer',fontWeight:600,fontSize:'0.85rem'}}>{MODES[m].label}</button>)}
        </div>
        <div style={{position:'relative',width:220,height:220,display:'flex',alignItems:'center',justifyContent:'center'}}>
          <svg width="220" height="220" style={{position:'absolute',top:0,left:0,transform:'rotate(-90deg)'}}>
            <circle cx="110" cy="110" r={r} fill="none" stroke="#1e293b" strokeWidth="8"/>
            <circle cx="110" cy="110" r={r} fill="none" stroke={cfg.color} strokeWidth="8" strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={circ*(1-pct/100)} style={{transition:'stroke-dashoffset 1s linear'}}/>
          </svg>
          <div style={{textAlign:'center',zIndex:1}}>
            <div style={{fontSize:'3.5rem',fontWeight:800,fontFamily:'JetBrains Mono,monospace',color:cfg.color,lineHeight:1}}>{fmt(time)}</div>
            <div style={{color:'#94a3b8',fontSize:'0.85rem',marginTop:'0.5rem'}}>{cfg.label}</div>
          </div>
        </div>
        <div style={{display:'flex',gap:'1rem'}}>
          <button onClick={()=>setRunning(r=>!r)} style={{padding:'0.75rem 2.5rem',background:cfg.color,color:'#fff',border:'none',borderRadius:10,cursor:'pointer',fontWeight:700,fontSize:'1rem'}}>
            {running?'⏸ Pause':'▶ Start'}
          </button>
          <button onClick={()=>{setTime(cfg.duration);setRunning(false)}} style={{padding:'0.75rem 1.5rem',background:'#1e293b',color:'#94a3b8',border:'1px solid #334155',borderRadius:10,cursor:'pointer',fontWeight:600}}>↺ Reset</button>
        </div>
        <div style={{display:'flex',gap:'2rem',background:'#1e293b',padding:'1rem 2rem',borderRadius:12,border:'1px solid #334155'}}>
          <div style={{textAlign:'center'}}><div style={{fontSize:'1.5rem',fontWeight:700,color:cfg.color}}>{sessions}</div><div style={{color:'#94a3b8',fontSize:'0.8rem'}}>Sessions</div></div>
          <div style={{textAlign:'center'}}><div style={{fontSize:'1.5rem',fontWeight:700,color:'#38bdf8'}}>{Math.floor(total/60)}m</div><div style={{color:'#94a3b8',fontSize:'0.8rem'}}>Focus Time</div></div>
        </div>
      </div>
    )
  }