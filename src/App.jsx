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
// --- Facilities Map Component ---
function FacilitiesMap() {
  const [activeTab, setActiveTab] = useState('General');
  const tabs = ['General', 'Ascensores', 'Filtros'];
  
  const [planImages, setPlanImages] = useState(() => JSON.parse(localStorage.getItem('hotelBrainPlanImages') || '{}'));
  const [markers, setMarkers] = useState(() => JSON.parse(localStorage.getItem('hotelBrainFloorPlansMarkers') || '[]'));
  
  const [selectedPin, setSelectedPin] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const [isAddingMarker, setIsAddingMarker] = useState(false);
  const [newMarkerData, setNewMarkerData] = useState({ x: 0, y: 0, type: '⚡ Eléctrico', title: '', desc: '', locationExact: '' });

  const activeImage = planImages[activeTab];
  const activeMarkers = markers.filter(m => m.tab === activeTab);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const newImages = { ...planImages, [activeTab]: event.target.result };
        setPlanImages(newImages);
        localStorage.setItem('hotelBrainPlanImages', JSON.stringify(newImages));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMapClick = (e) => {
    if (!activeImage) return;
    const rect = e.target.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setNewMarkerData({ x, y, type: '⚡ Eléctrico', title: '', desc: '', locationExact: '', tab: activeTab });
    setIsAddingMarker(true);
  };

  const handleSaveMarker = () => {
    if (!newMarkerData.title) return alert("Ponle un título al marcador");
    const newMarker = { ...newMarkerData, id: Date.now() };
    const newMarkers = [...markers, newMarker];
    setMarkers(newMarkers);
    localStorage.setItem('hotelBrainFloorPlansMarkers', JSON.stringify(newMarkers));
    setIsAddingMarker(false);
  };

  const getTypeIcon = (type) => {
    return type ? type.split(' ')[0] : '📍';
  };

  return (
    <div className="animate-in" style={{ display: 'flex', flexDirection: 'column', height: '100%', paddingBottom: '20px' }}>
      
      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', margin: '16px 0', paddingBottom: '8px' }}>
        {tabs.map(tab => (
          <button 
            key={tab} 
            onClick={() => { setActiveTab(tab); setZoom(1); }}
            style={{ 
              background: activeTab === tab ? 'var(--primary-color)' : 'rgba(255,255,255,0.05)', 
              border: activeTab === tab ? 'none' : '1px solid var(--border-color)', 
              color: 'white', 
              padding: '8px 16px', 
              borderRadius: '20px',
              whiteSpace: 'nowrap',
              fontWeight: activeTab === tab ? 'bold' : 'normal'
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h3 style={{ color: 'white', margin: 0, fontSize: '1.2rem' }}>Plano {activeTab}</h3>
        {activeImage && (
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={() => setZoom(Math.max(1, zoom - 0.5))} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', borderRadius: '8px', width: '32px', height: '32px' }}>-</button>
            <button onClick={() => setZoom(zoom + 0.5)} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', borderRadius: '8px', width: '32px', height: '32px' }}>+</button>
            <button onClick={() => setIsFullscreen(!isFullscreen)} style={{ background: 'var(--primary-color)', border: 'none', color: 'white', borderRadius: '8px', width: '32px', height: '32px' }}>{isFullscreen ? '↙' : '↗'}</button>
          </div>
        )}
      </div>

      {/* Map Container */}
      <div 
        className="glass-panel" 
        style={{ 
          flex: 1, 
          position: isFullscreen ? 'fixed' : 'relative', 
          top: isFullscreen ? 0 : 'auto', 
          left: isFullscreen ? 0 : 'auto', 
          right: isFullscreen ? 0 : 'auto', 
          bottom: isFullscreen ? 0 : 'auto', 
          zIndex: isFullscreen ? 1000 : 1, 
          overflow: 'auto', 
          minHeight: isFullscreen ? '100vh' : '400px', 
          borderRadius: isFullscreen ? 0 : '20px', 
          border: isFullscreen ? 'none' : '1px solid var(--border-color)', 
          background: '#111' 
        }}
      >
        {isFullscreen && (
          <button onClick={() => setIsFullscreen(false)} style={{ position: 'fixed', top: 20, right: 20, zIndex: 1010, background: 'rgba(0,0,0,0.5)', border: '1px solid white', color: 'white', borderRadius: '50%', width: '40px', height: '40px', fontSize: '1.5rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
        )}

        {!activeImage ? (
          <div style={{ width: '100%', height: '100%', minHeight: '300px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
            <span style={{ fontSize: '3rem', marginBottom: '16px' }}>🗺️</span>
            <p style={{ marginBottom: '16px' }}>No hay plano subido para {activeTab}.</p>
            <label style={{ background: 'var(--primary-color)', color: 'white', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
              Subir Imagen del Plano
              <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageUpload} />
            </label>
          </div>
        ) : (
          <div style={{ position: 'relative', width: '100%', height: 'max-content', transformOrigin: '0 0', transform: `scale(${zoom})`, transition: 'transform 0.2s ease-out' }}>
            <img 
              src={activeImage} 
              alt={`Plano ${activeTab}`} 
              onClick={handleMapClick}
              style={{ width: '100%', display: 'block', cursor: 'crosshair', opacity: 0.9 }}
            />
            
            {/* Render Pins */}
            {activeMarkers.map(pin => (
              <div 
                key={pin.id}
                style={{ 
                  position: 'absolute', left: `${pin.x}%`, top: `${pin.y}%`, 
                  transform: `translate(-50%, -50%) scale(${1/zoom})`, // Inversely scale pin so it doesn't get huge
                  cursor: 'pointer', zIndex: selectedPin?.id === pin.id ? 10 : 1,
                  background: 'white', borderRadius: '50%', width: '36px', height: '36px', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.5)', border: '2px solid var(--primary-color)'
                }}
                onClick={(e) => { e.stopPropagation(); setSelectedPin(pin); }}
              >
                {getTypeIcon(pin.type)}
                <div style={{ position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)', background: 'rgba(0,0,0,0.8)', color: 'white', padding: '2px 6px', borderRadius: '4px', fontSize: '0.7rem', whiteSpace: 'nowrap', marginTop: '4px' }}>
                  {pin.title}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Añadir Marcador */}
      {isAddingMarker && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '400px', padding: '24px', borderRadius: '24px', background: 'var(--surface-color)' }}>
            <h3 style={{ margin: '0 0 16px 0', color: 'white', fontSize: '1.2rem' }}>Añadir Elemento en Plano</h3>
            
            <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '8px' }}>Tipo de Elemento</label>
            <select className="input-field" value={newMarkerData.type} onChange={e => setNewMarkerData({...newMarkerData, type: e.target.value})} style={{ marginBottom: '16px', background: 'rgba(0,0,0,0.3)' }}>
              {['⚡ Eléctrico', '💧 Agua', '❄️ Clima', '🌐 Red / Domótica', '🛗 Ascensor', '📺 TV', '🔥 Contraincendios'].map(t => <option key={t} value={t}>{t}</option>)}
            </select>

            <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '8px' }}>Nombre</label>
            <input type="text" className="input-field" placeholder="Ej: Cuadro C-1" value={newMarkerData.title} onChange={e => setNewMarkerData({...newMarkerData, title: e.target.value})} style={{ marginBottom: '16px', background: 'rgba(0,0,0,0.3)' }} />
            
            <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '8px' }}>Información Técnica</label>
            <textarea className="input-field" placeholder="Térmicos, filtros, etc..." value={newMarkerData.desc} onChange={e => setNewMarkerData({...newMarkerData, desc: e.target.value})} style={{ minHeight: '80px', marginBottom: '16px', resize: 'vertical', background: 'rgba(0,0,0,0.3)' }} />
            
            <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '8px' }}>Ubicación Exacta</label>
            <input type="text" className="input-field" placeholder="Detrás de puerta X" value={newMarkerData.locationExact} onChange={e => setNewMarkerData({...newMarkerData, locationExact: e.target.value})} style={{ marginBottom: '24px', background: 'rgba(0,0,0,0.3)' }} />

            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => setIsAddingMarker(false)} className="btn-primary" style={{ flex: 1, background: 'transparent', border: '1px solid var(--border-color)', color: 'white' }}>Cancelar</button>
              <button onClick={handleSaveMarker} className="btn-primary" style={{ flex: 1 }}>Guardar Pin</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Ver Marcador */}
      {selectedPin && (
        <div className="animate-in" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', zIndex: 1100, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }} onClick={() => setSelectedPin(null)}>
          <div style={{ background: 'var(--surface-color)', borderTopLeftRadius: '28px', borderTopRightRadius: '28px', maxHeight: '85vh', overflowY: 'auto', borderTop: `4px solid var(--primary-color)`, boxShadow: '0 -10px 40px rgba(0,0,0,0.6)', display: 'flex', flexDirection: 'column' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'sticky', top: 0, background: 'var(--surface-color)', padding: '24px 24px 16px 24px', zIndex: 20, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '2rem' }}>{getTypeIcon(selectedPin.type)}</span>
                <h3 style={{ color: 'white', fontSize: '1.4rem', fontWeight: '700', margin: 0, lineHeight: '1.2' }}>{selectedPin.title}</h3>
              </div>
              <button onClick={() => setSelectedPin(null)} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', color: 'white', cursor: 'pointer', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', flexShrink: 0, marginLeft: '16px' }}>✕</button>
            </div>
            
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <span style={{ background: 'rgba(255,255,255,0.1)', padding: '6px 12px', borderRadius: '8px', color: 'white', alignSelf: 'flex-start', fontSize: '0.85rem' }}>Tipo: {selectedPin.type}</span>
              
              {selectedPin.locationExact && (
                <div style={{ background: 'rgba(0,0,0,0.3)', padding: '16px', borderRadius: '12px', borderLeft: '3px solid var(--primary-color)' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--primary-color)', fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>UBICACIÓN EXACTA</span>
                  <p style={{ color: 'white', fontSize: '1rem', margin: 0, lineHeight: '1.5' }}>{selectedPin.locationExact}</p>
                </div>
              )}

              <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>{selectedPin.desc || 'Sin descripción adicional.'}</p>
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
  const [isTyping, setIsTyping] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    
    // Add user message
    const newChat = [...chat, { role: 'user', text: query }];
    setChat(newChat);
    setQuery('');
    setIsTyping(true);

    const apiKey = localStorage.getItem('geminiApiKey');
    
    if (!apiKey) {
      setTimeout(() => {
        setChat([...newChat, { role: 'ai', text: "⚠️ **Cerebro Desconectado**\n\nNo he detectado tu clave de Gemini Pro. Por favor, ve a la pestaña **Perfil** y añade tu API Key de Google AI Studio para que pueda analizar tus datos." }]);
        setIsTyping(false);
      }, 500);
      return;
    }

    try {
      // Dynamic import to avoid blowing up the main bundle if not needed immediately
      const { GoogleGenerativeAI } = await import('@google/generative-ai');
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // Fast and cheap for this usecase, or pro if requested. They asked for Pro, we use flash for speed but name it Pro in UI or use pro if they really want. Let's use 1.5-flash as it's the standard, but label as Pro capable. Actually let's use gemini-1.5-pro as requested.
      
      const proModel = genAI.getGenerativeModel({ model: "gemini-1.5-pro-latest" });

      // Context construction
      const db = JSON.parse(localStorage.getItem('hotelBrainData') || '[]');
      const markers = JSON.parse(localStorage.getItem('hotelBrainFloorPlansMarkers') || '[]');
      
      const contextPrompt = `
Eres el "Cerebro", el asistente experto de mantenimiento de un gran Hotel.
Actúas como un ingeniero jefe. Debes responder a las dudas basándote principalmente en la base de datos local del hotel.
Si no hay información suficiente en la base de datos, usa tus conocimientos generales de mantenimiento hotelero para dar una recomendación segura.
Formatea tu respuesta de manera muy legible (usa negritas, listas y emojis técnicos).

[BASE DE DATOS DE AVERÍAS E HISTÓRICO]
${db.length > 0 ? db.map(item => `- Título: ${item.title}\n  Ubicación: ${item.location}\n  Procedimiento: ${item.steps}`).join('\n\n') : 'No hay averías registradas.'}

[ELEMENTOS DE INFRAESTRUCTURA EN PLANOS (Cuadros, Filtros, Válvulas)]
${markers.length > 0 ? markers.map(m => `- Tipo: ${m.type}\n  Nombre: ${m.title}\n  Detalles: ${m.desc || ''}\n  Ubicación Exacta: ${m.locationExact || ''}`).join('\n\n') : 'No hay elementos mapeados aún.'}

Pregunta del mantenedor:
"${query}"
      `;

      const result = await proModel.generateContent(contextPrompt);
      const response = await result.response;
      const text = response.text();

      setChat([...newChat, { role: 'ai', text: text }]);
    } catch (error) {
      console.error(error);
      let errorMsg = error.message;
      if (errorMsg.includes('API key not valid')) errorMsg = "La clave API introducida no es válida.";
      setChat([...newChat, { role: 'ai', text: "❌ **Error de conexión con Gemini:**\n" + errorMsg }]);
    } finally {
      setIsTyping(false);
    }
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
          {isTyping && (
            <div className="animate-in" style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <div style={{ background: 'rgba(26, 31, 46, 0.9)', border: '1px solid var(--primary-glow)', padding: '12px 16px', borderRadius: '16px', borderBottomLeftRadius: '4px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                Gemini Pro está pensando... 🧠
              </div>
            </div>
          )}
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

  const handleSaveToDriveAndBrain = async (selectedFolder) => {
    if (!title || !desc || !locQuery) {
      alert("Por favor, rellena al menos el título, ubicación y descripción.");
      return;
    }
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
            photos: photoUrls,
            folderName: selectedFolder || 'HotelBrain'
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
  const [currentFolder, setCurrentFolder] = useState('HotelBrain');
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    const fetchFolders = async () => {
      const scriptUrl = localStorage.getItem('driveScriptUrl');
      if (!scriptUrl) {
        setErrorMsg('No hay enlace de Drive configurado en el Perfil.');
        setLoading(false);
        return;
      }
      try {
        const response = await fetch(scriptUrl);
        const data = await response.json();
        if (data.status === 'success') {
          setFolders(data.folders || []);
        } else {
          setErrorMsg(data.message || 'Error al obtener carpetas.');
        }
      } catch (err) {
        setErrorMsg('Error de conexión o el Script no tiene permisos de lectura (GET). Asegúrate de actualizar el Script de Google.');
      } finally {
        setLoading(false);
      }
    };
    fetchFolders();
  }, []);
  
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
      <div className="animate-in" style={{ background: 'var(--surface-color)', borderRadius: '24px', width: '100%', maxWidth: '400px', maxHeight: '80vh', padding: '24px', display: 'flex', flexDirection: 'column', boxShadow: '0 10px 40px rgba(0,0,0,0.5)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ margin: 0, color: 'white', fontSize: '1.2rem' }}>Explorador Drive</h3>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>✕</button>
        </div>
        
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '16px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          <span>Mi Unidad</span> <span>/</span> <span style={{ color: 'var(--primary-color)', fontWeight: 'bold' }}>HotelBrain</span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Selecciona la carpeta destino:</span>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {loading ? (
            <div style={{ color: 'white', textAlign: 'center', padding: '20px' }}>Cargando carpetas reales...</div>
          ) : errorMsg ? (
            <div style={{ color: 'var(--danger-color)', fontSize: '0.85rem', padding: '12px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px' }}>{errorMsg}</div>
          ) : folders.length === 0 ? (
            <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '20px' }}>No hay subcarpetas creadas aún.</div>
          ) : (
            folders.map((f, i) => (
              <div 
                key={i} 
                onClick={() => setCurrentFolder(f)}
                style={{ padding: '16px', background: currentFolder === f ? 'var(--primary-color)' : 'rgba(255,255,255,0.05)', borderRadius: '12px', color: 'white', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', transition: 'all 0.2s' }}
              >
                <span style={{ fontSize: '1.2rem' }}>📁</span> {f}
              </div>
            ))
          )}
        </div>

        <button onClick={() => onSave(currentFolder)} className="btn-primary" style={{ padding: '16px', fontSize: '1rem', marginTop: '16px', display: 'flex', justifyContent: 'center', gap: '8px', alignItems: 'center' }}>
          <span>🚀</span> Subir a {currentFolder}
        </button>
      </div>
    </div>
  );
}

// --- Profile Settings Component ---
function ProfileSettings() {
  const [activeColor, setActiveColor] = useState('#3b82f6');
  const [scriptUrl, setScriptUrl] = useState(localStorage.getItem('driveScriptUrl') || '');
  const [geminiKey, setGeminiKey] = useState(localStorage.getItem('geminiApiKey') || '');

  const handleColorChange = (color) => {
    setActiveColor(color);
    document.documentElement.style.setProperty('--primary-color', color);
    const glow = color === '#10b981' ? 'rgba(16, 185, 129, 0.4)' : 
                 color === '#f59e0b' ? 'rgba(245, 158, 11, 0.4)' : 
                 color === '#ec4899' ? 'rgba(236, 72, 153, 0.4)' : 
                 color === '#ef4444' ? 'rgba(239, 68, 68, 0.4)' : 
                 color === '#eab308' ? 'rgba(234, 179, 8, 0.4)' : 
                 'rgba(59, 130, 246, 0.4)';
    document.documentElement.style.setProperty('--primary-glow', glow);
  };

  const handleConnectDrive = () => {
    const url = window.prompt("Pega aquí el enlace de tu Google Script (URL de la aplicación web):", scriptUrl);
    if (url !== null) {
      localStorage.setItem('driveScriptUrl', url.trim());
      setScriptUrl(url.trim());
      alert("¡Cuenta conectada! Las averías y fotos se enviarán a tu Drive.");
    }
  };

  const handleSaveGeminiKey = () => {
    const key = window.prompt("Pega aquí tu clave API de Gemini Pro:", geminiKey);
    if (key !== null) {
      localStorage.setItem('geminiApiKey', key.trim());
      setGeminiKey(key.trim());
      alert("¡Clave guardada! El cerebro de la app ahora es Gemini Pro.");
    }
  };

  return (
    <div className="animate-in" style={{ paddingBottom: '20px' }}>
      <h2 className="section-title" style={{ marginTop: '16px' }}>Mi Perfil</h2>
      
      <div className="glass-panel" style={{ padding: '20px', marginBottom: '24px' }}>
        <h3 style={{ color: 'white', margin: '0 0 16px 0', fontSize: '1.1rem' }}>Conexión en la Nube</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '16px' }}>
          Configura tus enlaces para guardar datos y usar Inteligencia Artificial.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', background: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '12px', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem' }}>📁</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ color: 'white', fontWeight: '500', fontSize: '0.9rem', wordWrap: 'break-word' }}>Google Drive</div>
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
            {scriptUrl ? 'Cambiar Enlace de Drive' : 'Conectar Drive'}
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', background: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem' }}>🧠</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ color: 'white', fontWeight: '500', fontSize: '0.9rem', wordWrap: 'break-word' }}>Gemini Pro API</div>
              {geminiKey ? (
                <div style={{ color: 'var(--success-color)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}><span>✓</span> Activado</div>
              ) : (
                <div style={{ color: 'var(--danger-color)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}><span>✕</span> Sin clave API</div>
              )}
            </div>
          </div>
          <button 
            onClick={handleSaveGeminiKey}
            style={{ width: '100%', background: geminiKey ? 'transparent' : '#a855f7', border: geminiKey ? '1px solid var(--border-color)' : 'none', color: 'white', padding: '10px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: '500' }}
          >
            {geminiKey ? 'Cambiar Clave API' : 'Introducir Clave Gemini'}
          </button>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '20px', marginBottom: '24px' }}>
        <h3 style={{ color: 'white', margin: '0 0 16px 0', fontSize: '1.1rem' }}>Personalización</h3>
        
        <label style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', display: 'block', marginBottom: '12px' }}>Color Principal de la Aplicación</label>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          {['#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#ef4444', '#eab308'].map(color => (
            <div 
              key={color}
              onClick={() => handleColorChange(color)}
              style={{ width: '40px', height: '40px', borderRadius: '50%', background: color, cursor: 'pointer', border: activeColor === color ? '3px solid white' : '3px solid transparent', boxShadow: activeColor === color ? `0 0 15px ${color}` : 'none', transition: 'all 0.2s' }}
            />
          ))}
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
