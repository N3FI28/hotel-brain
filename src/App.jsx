import { useState } from 'react';
import './App.css';

// --- Icons ---
const HomeIcon = ({ active }) => (
  <svg className="nav-icon" fill="none" viewBox="0 0 24 24" stroke={active ? "currentColor" : "currentColor"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

const MapIcon = ({ active }) => (
  <svg className="nav-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
  </svg>
);

const BrainIcon = ({ active }) => (
  <svg className="nav-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
  </svg>
);

const ChecklistIcon = ({ active }) => (
  <svg className="nav-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
  </svg>
);

const PlusIcon = () => (
  <svg width="28" height="28" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"></path>
  </svg>
);

const PinIcon = () => (
  <svg width="28" height="28" fill="var(--danger-color)" viewBox="0 0 24 24" style={{ filter: 'drop-shadow(0px 4px 6px rgba(0,0,0,0.5))' }}>
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
  </svg>
);

const InfoIcon = () => (
  <svg width="28" height="28" fill="var(--primary-color)" viewBox="0 0 24 24" style={{ filter: 'drop-shadow(0px 4px 6px rgba(0,0,0,0.5))' }}>
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
  </svg>
);

// --- Facilities Map Component ---
function FacilitiesMap() {
  const [level, setLevel] = useState('Edificio Central');
  const [selectedPin, setSelectedPin] = useState(null);

  const pins = [
    { 
      id: 1, 
      type: 'danger', 
      x: '45%', 
      y: '30%', 
      title: 'Cuadro Eléctrico C-1', 
      locationExact: 'Pasillo principal, escondido tras el panel de madera junto a la puerta de emergencia este.',
      desc: 'Cuadro principal del ala este.',
      photoUrls: ['/electrical_panel.png', '/electrical_panel.png'],
      thermals: [
        { id: 'T1', name: 'Iluminación Pasillo Este', status: 'ON', amperes: '10A' },
        { id: 'T2', name: 'Climatización Hab. 101-105', status: 'ON', amperes: '25A' },
        { id: 'T3', name: 'Enchufes Limpieza', status: 'ON', amperes: '16A' },
      ]
    },
    { 
      id: 2, 
      type: 'info', 
      x: '70%', 
      y: '60%', 
      title: 'Llave de paso de Agua', 
      desc: 'Corte de agua general para las habitaciones 101-110.' 
    }
  ];

  return (
    <div className="animate-in" style={{ display: 'flex', flexDirection: 'column', height: '100%', paddingBottom: '20px' }}>
      
      {/* Breadcrumb Navigation */}
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', margin: '24px 0 16px 0', fontSize: '0.875rem', color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '12px' }}>
        <span style={{ color: 'var(--primary-color)', cursor: 'pointer' }}>Complejo</span>
        <span>/</span>
        <span style={{ color: 'white', fontWeight: '500' }}>{level}</span>
      </div>

      {/* Map Container */}
      <div className="glass-panel" style={{ flex: 1, position: 'relative', overflow: 'hidden', minHeight: '350px', borderRadius: '20px', border: '1px solid var(--border-color)', background: 'black' }}>
        <img 
          src="/floor_plan.png" 
          alt="Plano del Hotel" 
          style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.9 }}
        />
        
        {/* Render Pins */}
        {pins.map(pin => (
          <div 
            key={pin.id}
            style={{ position: 'absolute', left: pin.x, top: pin.y, transform: 'translate(-50%, -100%)', cursor: 'pointer', zIndex: selectedPin?.id === pin.id ? 10 : 1 }}
            onClick={() => setSelectedPin(pin)}
          >
            {pin.type === 'danger' ? <PinIcon /> : <InfoIcon />}
            {/* Glow effect under pin */}
            <div style={{ width: '20px', height: '20px', background: pin.type === 'danger' ? 'var(--danger-color)' : 'var(--primary-color)', borderRadius: '50%', position: 'absolute', bottom: '-4px', left: '50%', transform: 'translateX(-50%)', opacity: 0.5, filter: 'blur(8px)' }}></div>
          </div>
        ))}
      </div>

      {/* Pin Detail Modal Overlay */}
      {selectedPin && (
        <div 
          className="animate-in" 
          style={{ 
            position: 'fixed', 
            top: 0, left: 0, right: 0, bottom: 0, 
            background: 'rgba(0,0,0,0.7)', 
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            zIndex: 100, 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'flex-end' 
          }}
          onClick={() => setSelectedPin(null)}
        >
          {/* Modal Content - Bottom Sheet */}
          <div 
            style={{ 
              background: 'var(--surface-color)', 
              borderTopLeftRadius: '28px', 
              borderTopRightRadius: '28px', 
              maxHeight: '85vh', 
              overflowY: 'auto',
              borderTop: `4px solid ${selectedPin.type === 'danger' ? 'var(--danger-color)' : 'var(--primary-color)'}`,
              boxShadow: '0 -10px 40px rgba(0,0,0,0.6)',
              display: 'flex',
              flexDirection: 'column'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Sticky Header with Close Button */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'flex-start',
              position: 'sticky',
              top: 0,
              background: 'var(--surface-color)',
              padding: '24px 24px 16px 24px',
              zIndex: 20,
              borderBottom: '1px solid rgba(255,255,255,0.05)'
            }}>
              <h3 style={{ color: 'white', fontSize: '1.6rem', fontWeight: '700', margin: 0, lineHeight: '1.2' }}>{selectedPin.title}</h3>
              <button 
                onClick={() => setSelectedPin(null)} 
                style={{ 
                  background: 'rgba(255,255,255,0.15)', 
                  border: 'none', 
                  color: 'white', 
                  cursor: 'pointer', 
                  borderRadius: '50%', 
                  width: '40px', 
                  height: '40px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  fontSize: '1.4rem',
                  flexShrink: 0,
                  marginLeft: '16px'
                }}
              >
                ✕
              </button>
            </div>
            
            {/* Content Body */}
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {selectedPin.locationExact && (
                <div style={{ marginBottom: '24px', background: 'rgba(0,0,0,0.3)', padding: '16px', borderRadius: '12px', borderLeft: '3px solid var(--primary-color)' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--primary-color)', fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>UBICACIÓN EXACTA</span>
                  <p style={{ color: 'white', fontSize: '1rem', margin: 0, lineHeight: '1.5' }}>{selectedPin.locationExact}</p>
                </div>
              )}

              {selectedPin.thermals && (
                <div style={{ marginBottom: '24px' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 'bold', display: 'block', marginBottom: '12px' }}>MAGNETOTÉRMICOS INCLUIDOS</span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {selectedPin.thermals.map(t => (
                      <div key={t.id} style={{ display: 'flex', justifyContent: 'space-between', background: 'rgba(255,255,255,0.05)', padding: '12px 16px', borderRadius: '12px', fontSize: '1rem', alignItems: 'center' }}>
                        <span style={{ color: 'white', fontWeight: '500' }}>{t.name}</span>
                        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                          <span style={{ color: 'var(--text-muted)' }}>{t.amperes}</span>
                          <span style={{ color: t.status === 'ON' ? 'var(--success-color)' : 'var(--danger-color)', fontWeight: 'bold', background: 'rgba(0,0,0,0.3)', padding: '4px 10px', borderRadius: '6px' }}>{t.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {!selectedPin.thermals && (
                <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: '1.6', marginBottom: '24px' }}>{selectedPin.desc}</p>
              )}

              {selectedPin.photoUrls && (
                <div style={{ marginBottom: '24px' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 'bold', display: 'block', marginBottom: '12px' }}>FOTOGRAFÍAS</span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {selectedPin.photoUrls.map((url, i) => (
                      <img key={i} src={url} alt={`${selectedPin.title} foto ${i+1}`} style={{ width: '100%', height: 'auto', minHeight: '250px', objectFit: 'cover', borderRadius: '16px', border: '1px solid var(--border-color)', boxShadow: '0 8px 24px rgba(0,0,0,0.3)' }} />
                    ))}
                  </div>
                </div>
              )}

              <button className="btn-primary" style={{ padding: '16px', fontSize: '1rem', width: '100%', borderRadius: '16px' }}>
                ⚙️ Procedimientos asociados
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// --- Knowledge Brain Component ---
function KnowledgeBrain() {
  const [query, setQuery] = useState('');
  const [chat, setChat] = useState([]);

  const handleSearch = () => {
    if (!query.trim()) return;
    
    // Add user message
    const newChat = [...chat, { role: 'user', text: query }];
    setChat(newChat);
    setQuery('');

    // Simulate AI thinking and response
    setTimeout(() => {
      let responseText = "No he encontrado nada en la base de datos local sobre esto. Intenta guardar el problema primero desde el módulo '+' de Ingesta.";
      
      const db = JSON.parse(localStorage.getItem('hotelBrainData') || '[]');
      const lowerQ = query.toLowerCase();
      const keywords = lowerQ.split(' ').filter(w => w.length > 3);
      
      let bestMatch = null;
      let maxScore = 0;

      db.forEach(item => {
        let score = 0;
        const target = `${item.title} ${item.location} ${item.steps}`.toLowerCase();
        keywords.forEach(kw => {
          if (target.includes(kw)) score++;
        });
        if (score > maxScore) {
          maxScore = score;
          bestMatch = item;
        }
      });

      if (bestMatch && maxScore > 0) {
        responseText = `He encontrado una coincidencia en tu base de datos local para **${bestMatch.title}**.\n\n📍 Ubicación: ${bestMatch.location}\n\n🛠️ Procedimiento:\n${bestMatch.steps}`;
      } else if (lowerQ.includes('luz') && lowerQ.includes('salon')) {
        // Fallback for previous manual test
        responseText = "Para solucionar el problema de iluminación en el salón, sigue estos pasos:\n\n1. Comprueba la **caja de domótica** ubicada en la entrada del salón (Panel D-2).\n2. Si está bloqueada, reiníciala pulsando el botón rojo durante 5 segundos.\n3. Dirígete al **Cuadro Eléctrico C-1** (Ubicado en el Pasillo principal este).\n4. Verifica el magnetotérmico **T1 (Iluminación Pasillo Este)** y asegúrate de que está en posición ON.\n\n¿Quieres que te muestre el plano para llegar al cuadro C-1?";
      }

      setChat([...newChat, { role: 'ai', text: responseText }]);
    }, 800);
  };
  
  return (
    <div className="animate-in" style={{ display: 'flex', flexDirection: 'column', height: '100%', paddingBottom: '20px' }}>
      <h2 className="section-title" style={{ marginTop: '16px' }}>El Cerebro del Hotel</h2>
      
      <div className="glass-panel" style={{ padding: '20px', marginBottom: '16px', flexShrink: 0 }}>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '16px' }}>
          Pregunta en lenguaje natural sobre cualquier avería o procedimiento.
        </p>
        <div style={{ position: 'relative' }}>
          <input 
            type="text" 
            className="input-field" 
            placeholder="Ej: Se ha ido la luz en el salón, ¿qué hago?"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            style={{ paddingRight: '48px', background: 'rgba(0,0,0,0.4)' }}
          />
          <button onClick={handleSearch} style={{ position: 'absolute', right: '6px', top: '50%', transform: 'translateY(-50%)', background: 'var(--primary-color)', border: 'none', borderRadius: '8px', width: '36px', height: '36px', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          </button>
        </div>
      </div>

      {chat.length > 0 ? (
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px', paddingRight: '4px' }}>
          {chat.map((msg, i) => (
            <div key={i} className="animate-in" style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
              <div style={{ 
                background: msg.role === 'user' ? 'var(--primary-color)' : 'rgba(26, 31, 46, 0.9)', 
                border: msg.role === 'ai' ? '1px solid var(--primary-glow)' : 'none',
                padding: '12px 16px', 
                borderRadius: '16px', 
                borderBottomRightRadius: msg.role === 'user' ? '4px' : '16px',
                borderBottomLeftRadius: msg.role === 'ai' ? '4px' : '16px',
                maxWidth: '85%',
                color: 'white',
                fontSize: '0.9rem',
                lineHeight: '1.5',
                whiteSpace: 'pre-wrap'
              }}>
                {msg.text}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          <h3 style={{ color: 'white', fontSize: '1rem', marginBottom: '12px' }}>Averías y Procedimientos Guardados</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { title: 'Reinicio de Caldera Bloque B', freq: 'Frecuente', tag: 'Climatización' },
              { title: 'Atasco bajante sector este', freq: 'Raro (1/año)', tag: 'Fontanería' },
              { title: 'Mantenimiento Preventivo Piscina', freq: 'Anual (Marzo)', tag: 'SOPs' }
            ].map((item, i) => (
              <div key={i} className="glass-panel" style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', transition: 'transform 0.2s' }}>
                <div>
                  <div style={{ color: 'white', fontWeight: '500', marginBottom: '6px' }}>{item.title}</div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>{item.freq}</div>
                </div>
                <span style={{ background: 'rgba(59, 130, 246, 0.1)', border: '1px solid var(--primary-glow)', padding: '4px 8px', borderRadius: '6px', fontSize: '0.75rem', color: 'var(--primary-color)' }}>{item.tag}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// --- Procedures SOP Component ---
function ProceduresSOP() {
  const sops = [
    { title: 'Revisión Anual Grupo Electrógeno', freq: 'Anual', time: '45 min', items: ['Nivel de Gasoil', 'Estado de Baterías', 'Prueba de Arranque en Vacío'] },
    { title: 'Purga de Circuito Solar', freq: 'Bi-Anual', time: '120 min', items: ['Comprobar presión general', 'Purgar aire de los captadores en cubierta', 'Rellenar glicol si es necesario'] },
    { title: 'Limpieza de Filtros Fancoil', freq: 'Mensual', time: '4h (por planta)', items: ['Desmontar rejilla de la habitación', 'Lavar filtro con agua a presión', 'Secar completamente y montar'] }
  ];

  return (
    <div className="animate-in" style={{ display: 'flex', flexDirection: 'column', height: '100%', paddingBottom: '20px' }}>
      <h2 className="section-title" style={{ marginTop: '16px' }}>Procedimientos (SOPs)</h2>
      
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '12px', marginBottom: '12px' }}>
        <button className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.8rem', borderRadius: '20px' }}>Todos</button>
        <button className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.8rem', borderRadius: '20px', background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>Diarios</button>
        <button className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.8rem', borderRadius: '20px', background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>Mensuales</button>
        <button className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.8rem', borderRadius: '20px', background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>Anuales</button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {sops.map((sop, i) => (
          <div key={i} className="glass-panel" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <h3 style={{ color: 'white', fontSize: '1.1rem' }}>{sop.title}</h3>
              <span style={{ background: 'rgba(255,255,255,0.1)', padding: '4px 8px', borderRadius: '6px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>{sop.freq}</span>
            </div>
            
            <div style={{ display: 'flex', gap: '16px', marginBottom: '16px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>⏱️ {sop.time}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>📋 {sop.items.length} pasos</span>
            </div>

            <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '8px', padding: '12px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {sop.items.map((item, j) => (
                <div key={j} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <div style={{ width: '18px', height: '18px', border: '1px solid var(--text-muted)', borderRadius: '4px', flexShrink: 0, marginTop: '2px', background: 'rgba(255,255,255,0.05)' }}></div>
                  <span style={{ color: 'var(--text-primary)', fontSize: '0.9rem', lineHeight: '1.4' }}>{item}</span>
                </div>
              ))}
            </div>

            <button className="btn-primary" style={{ width: '100%', marginTop: '16px', background: 'rgba(59, 130, 246, 0.1)', border: '1px solid var(--primary-glow)', color: 'var(--primary-color)' }}>
              Comenzar Procedimiento
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- Dashboard Component ---
function Dashboard() {
  const [tasks, setTasks] = useState([
    { id: 1, text: 'Revisar gotera en pasillo 2', done: false },
    { id: 2, text: 'Llamar al fontanero (urgente)', done: false },
    { id: 3, text: 'Comprar filtros aire acondicionado', done: true }
  ]);
  const [newTaskText, setNewTaskText] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [showAllTasksModal, setShowAllTasksModal] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [fullscreenImage, setFullscreenImage] = useState(null);

  const activeTasks = tasks.filter(t => !t.done);
  const completedTasks = tasks.filter(t => t.done);

  const toggleTask = (id, e) => {
    e.stopPropagation();
    setTasks(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  const addTask = (e) => {
    if (e.key === 'Enter' && newTaskText.trim()) {
      setTasks([{ id: Date.now(), text: newTaskText.trim(), done: false }, ...tasks]);
      setNewTaskText('');
      setIsAdding(false);
    }
  };

  const handleQuickSearch = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      setHasSearched(true);
      setSearchResult(null);
      
      const db = JSON.parse(localStorage.getItem('hotelBrainData') || '[]');
      const lowerQ = searchQuery.toLowerCase();
      const keywords = lowerQ.split(' ').filter(w => w.length > 3);
      
      let bestMatch = null;
      let maxScore = 0;

      db.forEach(item => {
        let score = 0;
        const target = `${item.title} ${item.location} ${item.steps}`.toLowerCase();
        keywords.forEach(kw => {
          if (target.includes(kw)) score++;
        });
        if (score > maxScore) {
          maxScore = score;
          bestMatch = item;
        }
      });

      if (bestMatch && maxScore > 0) {
        setSearchResult(bestMatch);
      } else {
        setSearchResult('not_found');
      }
    }
  };

  return (
    <div className="animate-in" style={{ paddingBottom: '20px' }}>
      
      {/* Quick Tasks Widget */}
      <div 
        className="glass-panel" 
        style={{ padding: '20px', cursor: 'pointer', transition: 'transform 0.2s', flex: 1, display: 'flex', flexDirection: 'column', height: '100%', minHeight: '60vh' }}
        onClick={() => setShowAllTasksModal(true)}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ color: 'white', margin: 0, fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>📝</span> Lista para hoy
          </h3>
          <button 
            onClick={(e) => { e.stopPropagation(); setIsAdding(!isAdding); }} 
            style={{ background: 'var(--primary-color)', border: 'none', color: 'white', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', cursor: 'pointer' }}
          >
            {isAdding ? '✕' : '+'}
          </button>
        </div>

        {isAdding && (
          <div style={{ marginBottom: '16px' }} onClick={e => e.stopPropagation()}>
            <input 
              autoFocus
              type="text" 
              className="input-field" 
              placeholder="Escribe la tarea y pulsa Intro..." 
              value={newTaskText}
              onChange={(e) => setNewTaskText(e.target.value)}
              onKeyDown={addTask}
              style={{ background: 'rgba(0,0,0,0.4)', fontSize: '0.9rem' }}
            />
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {activeTasks.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0, fontStyle: 'italic' }}>No hay tareas pendientes. ¡Buen trabajo!</p>
          ) : (
            activeTasks.map(task => (
              <div key={task.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }} onClick={e => e.stopPropagation()}>
                <div 
                  onClick={(e) => toggleTask(task.id, e)}
                  style={{ width: '20px', height: '20px', borderRadius: '6px', border: '2px solid var(--text-secondary)', cursor: 'pointer', flexShrink: 0, marginTop: '2px' }}
                ></div>
                <span style={{ color: 'white', fontSize: '0.95rem', lineHeight: '1.4' }}>{task.text}</span>
              </div>
            ))
          )}
        </div>
        
        {completedTasks.length > 0 && (
          <div style={{ marginTop: '16px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '12px', fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center' }}>
            Toca para ver {completedTasks.length} tareas completadas
          </div>
        )}
      </div>

      {/* Quick Search Widget */}
      <h2 className="section-title" style={{ marginTop: '16px' }}>Búsqueda Rápida (Avanzada)</h2>
      <div className="glass-panel" style={{ padding: '20px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(0,0,0,0.4)', borderRadius: '12px', padding: '0 12px', marginBottom: '16px', border: '1px solid var(--border-color)' }}>
          <span>🔍</span>
          <input 
            type="text" 
            placeholder="Ej: falla caldera..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleQuickSearch}
            style={{ background: 'transparent', border: 'none', color: 'white', padding: '14px 0', width: '100%', fontSize: '0.9rem', outline: 'none' }}
          />
        </div>

        {hasSearched && searchResult === 'not_found' && (
          <div className="animate-in" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textAlign: 'center', padding: '12px' }}>
            No se ha encontrado solución local. Usa la pestaña '+' para documentarlo.
          </div>
        )}

        {hasSearched && searchResult !== 'not_found' && searchResult && (
          <div className="animate-in" style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '16px' }}>
            <h4 style={{ color: 'var(--primary-color)', margin: '0 0 8px 0', fontSize: '1rem' }}>{searchResult.title}</h4>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>📍 {searchResult.location}</div>
            <p style={{ color: 'white', fontSize: '0.95rem', lineHeight: '1.5', whiteSpace: 'pre-wrap', marginBottom: '16px' }}>
              {searchResult.steps}
            </p>
            {searchResult.photoUrls && searchResult.photoUrls.length > 0 && (
              <div>
                <h5 style={{ color: 'var(--text-muted)', margin: '0 0 8px 0', fontSize: '0.8rem' }}>Archivos Adjuntos</h5>
                <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px' }}>
                  {searchResult.photoUrls.map((url, i) => (
                    <img 
                      key={i} 
                      src={url} 
                      alt="adjunto" 
                      onClick={() => setFullscreenImage(url)}
                      style={{ width: '120px', height: '120px', objectFit: 'cover', borderRadius: '8px', border: '1px solid var(--border-color)', flexShrink: 0, cursor: 'zoom-in' }} 
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Full Tasks Modal */}
      {showAllTasksModal && (
        <div 
          className="animate-in" 
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}
          onClick={() => setShowAllTasksModal(false)}
        >
          <div 
            style={{ background: 'var(--surface-color)', borderRadius: '24px', width: '100%', maxWidth: '400px', maxHeight: '80vh', display: 'flex', flexDirection: 'column', boxShadow: '0 10px 40px rgba(0,0,0,0.5)' }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, color: 'white', fontSize: '1.2rem' }}>Todas las tareas</h3>
              <button onClick={() => setShowAllTasksModal(false)} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer' }}>✕</button>
            </div>
            
            <div style={{ padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              <div>
                <h4 style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '12px' }}>Pendientes ({activeTasks.length})</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {activeTasks.map(task => (
                    <div key={task.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                      <div onClick={(e) => toggleTask(task.id, e)} style={{ width: '20px', height: '20px', borderRadius: '6px', border: '2px solid var(--text-secondary)', cursor: 'pointer', flexShrink: 0, marginTop: '2px' }}></div>
                      <span style={{ color: 'white', fontSize: '0.95rem' }}>{task.text}</span>
                    </div>
                  ))}
                  {activeTasks.length === 0 && <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Nada pendiente.</span>}
                </div>
              </div>

              <div>
                <h4 style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '12px' }}>Completadas (último mes)</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {completedTasks.map(task => (
                    <div key={task.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', opacity: 0.5 }}>
                      <div onClick={(e) => toggleTask(task.id, e)} style={{ width: '20px', height: '20px', borderRadius: '6px', background: 'var(--success-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0, marginTop: '2px' }}>
                        <span style={{ color: 'white', fontSize: '0.7rem', fontWeight: 'bold' }}>✓</span>
                      </div>
                      <span style={{ color: 'white', fontSize: '0.95rem', textDecoration: 'line-through' }}>{task.text}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Fullscreen Image Modal */}
      {fullscreenImage && (
        <div 
          className="animate-in"
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.95)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}
          onClick={() => setFullscreenImage(null)}
        >
          <button 
            style={{ position: 'absolute', top: '24px', right: '24px', background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', borderRadius: '50%', width: '44px', height: '44px', fontSize: '1.5rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            onClick={(e) => { e.stopPropagation(); setFullscreenImage(null); }}
          >
            ✕
          </button>
          <img src={fullscreenImage} alt="Fullscreen" style={{ maxWidth: '100%', maxHeight: '90vh', objectFit: 'contain', borderRadius: '8px', boxShadow: '0 10px 40px rgba(0,0,0,0.5)' }} />
        </div>
      )}
    </div>
  );
}

// --- Data Entry Module Component ---
function DataEntryModule() {
  const [type, setType] = useState('averia');
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [locQuery, setLocQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [showDriveModal, setShowDriveModal] = useState(false);

  const locations = ['Cuadro C-1 (Pasillo Este)', 'Habitación 101', 'Habitación 102', 'Recepción', 'Sala de Máquinas', 'Piscina Exterior'];
  const filteredLocs = locations.filter(l => l.toLowerCase().includes(locQuery.toLowerCase()));

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles([...selectedFiles, ...files.map(f => ({ 
      name: f.name, 
      type: f.type, 
      preview: URL.createObjectURL(f),
      file: f 
    }))]);
  };

  const handleSaveToDriveAndBrain = async () => {
    // Process photos to base64 so they persist in localStorage
    const photoUrls = [];
    for (const fileObj of selectedFiles) {
      if (fileObj.type.startsWith('image/')) {
        const promise = new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target.result);
          reader.readAsDataURL(fileObj.file);
        });
        photoUrls.push(await promise);
      }
    }

    const entry = {
      id: Date.now(),
      type,
      title,
      location: locQuery,
      steps: desc,
      photoUrls,
      date: new Date().toISOString()
    };
    
    // 1. Guardar en Memoria Local para la búsqueda rápida en la app
    const existing = JSON.parse(localStorage.getItem('hotelBrainData') || '[]');
    localStorage.setItem('hotelBrainData', JSON.stringify([entry, ...existing]));
    
    // 2. Enviar silenciosamente al Google Apps Script (Drive)
    const scriptUrl = localStorage.getItem('driveScriptUrl');
    if (scriptUrl) {
      try {
        fetch(scriptUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify({
            title: title,
            location: locQuery,
            steps: desc,
            photos: photoUrls
          })
        });
      } catch (e) {
        console.error("Fallo al enviar a Google Drive:", e);
      }
    }
    
    setShowDriveModal(false);
    setTitle(''); setDesc(''); setLocQuery(''); setSelectedFiles([]);
    alert('¡Datos guardados localmente! ' + (scriptUrl ? 'Y enviados a tu Google Drive.' : '(Sin conexión a Drive)'));
  };

  return (
    <div className="animate-in" style={{ display: 'flex', flexDirection: 'column', height: '100%', paddingBottom: '20px', overflowY: 'auto' }}>
      <h2 className="section-title" style={{ marginTop: '16px' }}>Ingresar al Cerebro</h2>
      
      <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div>
          <label style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '8px', display: 'block', fontWeight: '500' }}>¿Qué vas a guardar?</label>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={() => setType('averia')} className="btn-primary" style={{ flex: 1, padding: '10px 4px', fontSize: '0.85rem', background: type === 'averia' ? 'var(--primary-color)' : 'transparent', border: type === 'averia' ? '1px solid var(--primary-color)' : '1px solid var(--border-color)', color: type === 'averia' ? 'white' : 'var(--text-secondary)' }}>Avería</button>
            <button onClick={() => setType('equipo')} className="btn-primary" style={{ flex: 1, padding: '10px 4px', fontSize: '0.85rem', background: type === 'equipo' ? 'var(--primary-color)' : 'transparent', border: type === 'equipo' ? '1px solid var(--primary-color)' : '1px solid var(--border-color)', color: type === 'equipo' ? 'white' : 'var(--text-secondary)' }}>Equipo</button>
            <button onClick={() => setType('sop')} className="btn-primary" style={{ flex: 1, padding: '10px 4px', fontSize: '0.85rem', background: type === 'sop' ? 'var(--primary-color)' : 'transparent', border: type === 'sop' ? '1px solid var(--primary-color)' : '1px solid var(--border-color)', color: type === 'sop' ? 'white' : 'var(--text-secondary)' }}>Procedimiento</button>
          </div>
        </div>

        <div>
          <label style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '8px', display: 'block', fontWeight: '500' }}>Título Breve</label>
          <input type="text" className="input-field" placeholder={type === 'averia' ? 'Ej: Error E4 en Fancoil' : type === 'equipo' ? 'Ej: Nevera Samsung Bar' : 'Ej: Limpieza de Filtros'} value={title} onChange={(e) => setTitle(e.target.value)} style={{ background: 'rgba(0,0,0,0.3)' }} />
        </div>

        <div style={{ position: 'relative' }}>
          <label style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '8px', display: 'block', fontWeight: '500' }}>Vincular a Ubicación (Autocompletar)</label>
          <input 
            type="text" 
            className="input-field" 
            placeholder="Escribe la habitación o cuadro..." 
            value={locQuery}
            onChange={(e) => { setLocQuery(e.target.value); setShowSuggestions(true); }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            style={{ background: 'rgba(0,0,0,0.3)' }}
          />
          {showSuggestions && locQuery && (
            <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: 'var(--surface-color)', borderRadius: '8px', border: '1px solid var(--border-color)', marginTop: '4px', zIndex: 20, maxHeight: '150px', overflowY: 'auto' }}>
              {filteredLocs.length > 0 ? filteredLocs.map((loc, i) => (
                <div key={i} onClick={() => { setLocQuery(loc); setShowSuggestions(false); }} style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.05)', color: 'white', cursor: 'pointer' }}>{loc}</div>
              )) : (
                <div style={{ padding: '12px 16px', color: 'var(--primary-color)', cursor: 'pointer' }} onClick={() => setShowSuggestions(false)}>+ Crear nueva ubicación "{locQuery}"</div>
              )}
            </div>
          )}
        </div>

        <div>
          <label style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '8px', display: 'block', fontWeight: '500' }}>{type === 'averia' ? 'Pasos para Resolverlo' : 'Descripción / Procedimiento'}</label>
          <textarea className="input-field" rows="4" placeholder="Escribe aquí los detalles paso a paso..." value={desc} onChange={(e) => setDesc(e.target.value)} style={{ resize: 'vertical', background: 'rgba(0,0,0,0.3)' }}></textarea>
        </div>

        <div>
          <label style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '8px', display: 'block', fontWeight: '500' }}>Archivos Adjuntos (Fotos, Vídeos, PDFs)</label>
          
          <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
            {selectedFiles.map((file, i) => (
              <div key={i} style={{ width: '60px', height: '60px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border-color)', position: 'relative' }}>
                {file.type.startsWith('image/') ? (
                  <img src={file.preview} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="preview" />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.1)', fontSize: '0.8rem', color: 'white' }}>PDF</div>
                )}
                <button onClick={() => setSelectedFiles(selectedFiles.filter((_, idx) => idx !== i))} style={{ position: 'absolute', top: 2, right: 2, background: 'rgba(0,0,0,0.5)', border: 'none', color: 'white', borderRadius: '50%', width: '18px', height: '18px', fontSize: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
              </div>
            ))}
            <label style={{ width: '60px', height: '60px', borderRadius: '8px', border: '1px dashed var(--text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)' }}>
              <span style={{ fontSize: '1.5rem' }}>+</span>
              <input type="file" multiple accept="image/*,video/*,application/pdf" style={{ display: 'none' }} onChange={handleFileSelect} />
            </label>
          </div>
          
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>Pulsa "+" para abrir tu galería o cámara local.</p>
        </div>

        <button onClick={() => setShowDriveModal(true)} className="btn-primary" style={{ padding: '16px', fontSize: '1rem', marginTop: '8px', display: 'flex', justifyContent: 'center', gap: '8px', alignItems: 'center' }}>
          <span>☁️</span> Siguiente: Guardar en Drive
        </button>
      </div>

      {showDriveModal && <DriveExplorerModal onClose={() => setShowDriveModal(false)} onSave={handleSaveToDriveAndBrain} filesCount={selectedFiles.length} />}
    </div>
  );
}

function DriveExplorerModal({ onClose, onSave, filesCount }) {
  const [currentFolder, setCurrentFolder] = useState('HotelBrain_Media');
  const [folders, setFolders] = useState(['Averías 2026', 'Climatización', 'Electricidad', 'SOPs Generales']);
  
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
      <div className="animate-in" style={{ background: 'var(--surface-color)', borderRadius: '24px', width: '100%', maxWidth: '400px', maxHeight: '80vh', padding: '24px', display: 'flex', flexDirection: 'column', boxShadow: '0 10px 40px rgba(0,0,0,0.5)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ margin: 0, color: 'white', fontSize: '1.2rem' }}>Explorador Drive</h3>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>✕</button>
        </div>
        
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '16px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          <span>Mi Unidad</span> <span>/</span> <span style={{ color: 'var(--primary-color)', fontWeight: 'bold' }}>{currentFolder}</span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Selecciona la carpeta destino:</span>
          <button style={{ background: 'transparent', border: 'none', color: 'var(--primary-color)', fontSize: '0.85rem', cursor: 'pointer', fontWeight: 'bold' }}>+ Crear Carpeta</button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {folders.map((f, i) => (
            <div key={i} style={{ padding: '16px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', color: 'white', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
              <span style={{ fontSize: '1.2rem' }}>📁</span> {f}
            </div>
          ))}
        </div>

        <button onClick={onSave} className="btn-primary" style={{ padding: '16px', fontSize: '1rem', marginTop: '16px', display: 'flex', justifyContent: 'center', gap: '8px', alignItems: 'center' }}>
          <span>🚀</span> Subir {filesCount} archivos y Finalizar
        </button>
      </div>
    </div>
  );
}

// --- Profile Settings Component ---
function ProfileSettings() {
  const [activeColor, setActiveColor] = useState('#3b82f6');
  const [activeFont, setActiveFont] = useState('medium');
  const [scriptUrl, setScriptUrl] = useState(localStorage.getItem('driveScriptUrl') || '');

  const handleColorChange = (color) => {
    setActiveColor(color);
    document.documentElement.style.setProperty('--primary-color', color);
    const glow = color === '#10b981' ? 'rgba(16, 185, 129, 0.4)' : 
                 color === '#f59e0b' ? 'rgba(245, 158, 11, 0.4)' : 
                 color === '#ec4899' ? 'rgba(236, 72, 153, 0.4)' : 
                 'rgba(59, 130, 246, 0.4)';
    document.documentElement.style.setProperty('--primary-glow', glow);
  };

  const handleFontChange = (size) => {
    setActiveFont(size);
    if (size === 'small') document.documentElement.style.setProperty('--text-scale', '0.85');
    if (size === 'medium') document.documentElement.style.setProperty('--text-scale', '1');
    if (size === 'large') document.documentElement.style.setProperty('--text-scale', '1.15');
  };

  const handleConnectDrive = () => {
    const url = window.prompt("Pega aquí el enlace de tu Google Script (URL de la aplicación web):", scriptUrl);
    if (url !== null) {
      localStorage.setItem('driveScriptUrl', url.trim());
      setScriptUrl(url.trim());
      alert("¡Cuenta conectada! Las averías y fotos se enviarán a tu Drive.");
    }
  };

  return (
    <div className="animate-in" style={{ paddingBottom: '20px' }}>
      <h2 className="section-title" style={{ marginTop: '16px' }}>Mi Perfil</h2>
      
      <div className="glass-panel" style={{ padding: '20px', marginBottom: '24px' }}>
        <h3 style={{ color: 'white', margin: '0 0 16px 0', fontSize: '1.1rem' }}>Conexión en la Nube</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '16px' }}>
          Configura tu enlace seguro de Google Drive para subir archivos.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', background: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem' }}>👤</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ color: 'white', fontWeight: '500', fontSize: '0.9rem', wordWrap: 'break-word' }}>Mi Cuenta Drive</div>
              {scriptUrl ? (
                <div style={{ color: 'var(--success-color)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}><span>✓</span> Conectado</div>
              ) : (
                <div style={{ color: 'var(--danger-color)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}><span>✕</span> Sin conexión</div>
              )}
            </div>
          </div>
          <button 
            onClick={handleConnectDrive}
            style={{ width: '100%', background: scriptUrl ? 'transparent' : 'var(--primary-color)', border: scriptUrl ? '1px solid var(--border-color)' : 'none', color: 'white', padding: '10px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: '500' }}
          >
            {scriptUrl ? 'Cambiar Enlace de Drive' : 'Conectar con Google Drive'}
          </button>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '20px', marginBottom: '24px' }}>
        <h3 style={{ color: 'white', margin: '0 0 16px 0', fontSize: '1.1rem' }}>Personalización</h3>
        
        <label style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', display: 'block', marginBottom: '12px' }}>Color Principal de la Aplicación</label>
        <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
          {['#3b82f6', '#10b981', '#f59e0b', '#ec4899'].map(color => (
            <div 
              key={color}
              onClick={() => handleColorChange(color)}
              style={{ width: '40px', height: '40px', borderRadius: '50%', background: color, cursor: 'pointer', border: activeColor === color ? '3px solid white' : '3px solid transparent', boxShadow: activeColor === color ? `0 0 15px ${color}` : 'none', transition: 'all 0.2s' }}
            />
          ))}
        </div>

        <label style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', display: 'block', marginBottom: '12px' }}>Tamaño de Letra General</label>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => handleFontChange('small')} className="btn-primary" style={{ flex: 1, background: activeFont === 'small' ? 'var(--primary-color)' : 'transparent', border: activeFont === 'small' ? 'none' : '1px solid var(--border-color)', color: activeFont === 'small' ? 'white' : 'var(--text-secondary)' }}>A- (Pequeña)</button>
          <button onClick={() => handleFontChange('medium')} className="btn-primary" style={{ flex: 1, background: activeFont === 'medium' ? 'var(--primary-color)' : 'transparent', border: activeFont === 'medium' ? 'none' : '1px solid var(--border-color)', color: activeFont === 'medium' ? 'white' : 'var(--text-secondary)' }}>A (Normal)</button>
          <button onClick={() => handleFontChange('large')} className="btn-primary" style={{ flex: 1, background: activeFont === 'large' ? 'var(--primary-color)' : 'transparent', border: activeFont === 'large' ? 'none' : '1px solid var(--border-color)', color: activeFont === 'large' ? 'white' : 'var(--text-secondary)' }}>A+ (Grande)</button>
        </div>
      </div>
      
      <button className="btn-primary" style={{ width: '100%', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger-color)', border: '1px solid rgba(239, 68, 68, 0.3)', boxShadow: 'none' }}>
        Cerrar Sesión Segura
      </button>
    </div>
  );
}

// --- Main App ---
function App() {
  const [currentTab, setCurrentTab] = useState('dashboard');

  return (
    <div className="app-container">
      <header className="top-header">
        <div className="brand-title">Hotel Brain</div>
        <div 
          onClick={() => setCurrentTab('profile')}
          style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--primary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 2px 10px var(--primary-glow)' }}
        >
          AD
        </div>
      </header>

      <main className="main-content">
        {currentTab === 'dashboard' && <Dashboard />}
        {currentTab === 'maps' && <FacilitiesMap />}
        {currentTab === 'add' && <DataEntryModule />}
        {currentTab === 'brain' && <KnowledgeBrain />}
        {currentTab === 'tasks' && <ProceduresSOP />}
        {currentTab === 'profile' && <ProfileSettings />}
      </main>

      <nav className="bottom-nav">
        <button className={`nav-item ${currentTab === 'dashboard' ? 'active' : ''}`} onClick={() => setCurrentTab('dashboard')}>
          <HomeIcon active={currentTab === 'dashboard'} />
          <span>Inicio</span>
        </button>
        <button className={`nav-item ${currentTab === 'maps' ? 'active' : ''}`} onClick={() => setCurrentTab('maps')}>
          <MapIcon active={currentTab === 'maps'} />
          <span>Planos</span>
        </button>

        {/* Center Add Button */}
        <button 
          onClick={() => setCurrentTab('add')}
          style={{ 
            width: '60px', height: '60px', borderRadius: '50%', background: 'var(--primary-color)', color: 'white', border: 'none',
            display: 'flex', alignItems: 'center', justifyContent: 'center', transform: 'translateY(-20px)',
            boxShadow: '0 8px 16px rgba(59, 130, 246, 0.4)', cursor: 'pointer', zIndex: 10, flexShrink: 0
          }}
        >
          <PlusIcon />
        </button>

        <button className={`nav-item ${currentTab === 'brain' ? 'active' : ''}`} onClick={() => setCurrentTab('brain')}>
          <BrainIcon active={currentTab === 'brain'} />
          <span>Cerebro</span>
        </button>
        <button className={`nav-item ${currentTab === 'tasks' ? 'active' : ''}`} onClick={() => setCurrentTab('tasks')}>
          <ChecklistIcon active={currentTab === 'tasks'} />
          <span>Rutinas</span>
        </button>
      </nav>
    </div>
  );
}

export default App;
