import { EmailTemplate } from './email-template';
import { render } from '@react-email/render';

export function PreviewEmail() {
  const emailHtml = render(EmailTemplate({ email: 'test@example.com' }));
  
  return (
    <div>
      <h1>Email Preview</h1>
      <div
        dangerouslySetInnerHTML={{ __html: emailHtml }}
        style={{
          maxWidth: '600px',
          margin: '0 auto',
          border: '1px solid #e2e8f0',
          borderRadius: '8px',
          padding: '16px',
        }}
      />
    </div>
  );
}
