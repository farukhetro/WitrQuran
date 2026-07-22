export default function ContactPage() {
  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '4rem 1.5rem', minHeight: '60vh' }}>
      <h1 style={{ fontSize: '3rem', fontWeight: 600, color: 'var(--primary)', marginBottom: '1rem', textAlign: 'center' }}>
        Contact Us
      </h1>
      <p style={{ color: 'var(--muted)', textAlign: 'center', marginBottom: '3rem', fontSize: '1.1rem' }}>
        Have questions or feedback? We'd love to hear from you.
      </p>

      <div style={{ 
        backgroundColor: 'var(--surface)', 
        border: '1px solid var(--border)', 
        borderRadius: '16px', 
        padding: '2.5rem',
      }}>
        <form style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--primary)' }}>Name</label>
            <input 
              type="text" 
              placeholder="Your Name" 
              disabled
              style={{
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                border: '1px solid var(--border)',
                backgroundColor: 'var(--background)',
                fontFamily: 'inherit',
                outline: 'none'
              }}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--primary)' }}>Email</label>
            <input 
              type="email" 
              placeholder="your@email.com" 
              disabled
              style={{
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                border: '1px solid var(--border)',
                backgroundColor: 'var(--background)',
                fontFamily: 'inherit',
                outline: 'none'
              }}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--primary)' }}>Message</label>
            <textarea 
              placeholder="How can we help you?" 
              rows={5}
              disabled
              style={{
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                border: '1px solid var(--border)',
                backgroundColor: 'var(--background)',
                fontFamily: 'inherit',
                outline: 'none',
                resize: 'none'
              }}
            />
          </div>
          <button 
            disabled
            style={{
              padding: '1rem',
              borderRadius: '8px',
              backgroundColor: 'var(--highlight)',
              color: 'white',
              border: 'none',
              fontWeight: 500,
              fontSize: '1rem',
              marginTop: '1rem',
              cursor: 'not-allowed',
              opacity: 0.7
            }}>
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
}
