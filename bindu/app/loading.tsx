export default function Loading() {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: '#FAFAFA',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      gap: '2rem',
    }}>
      <style>{`
        @keyframes pulse-bindu {
          0%   { transform: scale(0.9); opacity: 0.7; }
          50%  { transform: scale(1.1); opacity: 1; box-shadow: 0 0 20px rgba(226, 74, 0, 0.4); }
          100% { transform: scale(0.9); opacity: 0.7; }
        }
        @keyframes fade-text {
          0%   { opacity: 0.3; }
          50%  { opacity: 0.8; }
          100% { opacity: 0.3; }
        }
      `}</style>

      {/* Pulsating Bindu (Dot) */}
      <div style={{
        width: '40px',
        height: '40px',
        background: '#E24A00', // Premium Orange
        borderRadius: '50%',
        animation: 'pulse-bindu 1.5s ease-in-out infinite',
      }} />

      <div style={{
        fontFamily: 'Montserrat, sans-serif',
        fontSize: '14px',
        fontWeight: 600,
        letterSpacing: '0.3em',
        color: '#0A1128',
        textTransform: 'uppercase',
        animation: 'fade-text 1.5s ease-in-out infinite',
      }}>
        Bindu Premium
      </div>
    </div>
  );
}
