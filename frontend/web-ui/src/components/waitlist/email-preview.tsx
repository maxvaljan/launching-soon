import { EmailTemplate } from './email-template';
import { render } from '@react-email/render';
import './email-styles.css';

export function PreviewEmail() {
  const emailHtml = render(EmailTemplate({ email: 'test@example.com' }));
  
  return (
    <div>
      <h1>Email Preview</h1>
      <div
        dangerouslySetInnerHTML={{ __html: emailHtml }}
        className="email-preview-container"
      />
    </div>
  );
}
