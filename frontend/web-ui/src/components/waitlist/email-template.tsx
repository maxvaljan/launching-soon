import * as React from 'react';
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from '@react-email/components';

export interface EmailTemplateProps {
  email: string;
}

export function EmailTemplate({ email }: EmailTemplateProps) {
  return (
    <Html>
      <Head />
      <Preview>Thank you for joining Maxmove's launch waitlist!</Preview>
      <Tailwind>
        <Body className="bg-gray-100 font-sans">
          <Container className="mx-auto my-[40px] bg-white p-[20px] rounded-lg shadow-sm max-w-[600px]">
            <Section className="pt-[16px]">
              <Img
                src="https://whadz2ols6ge6eli.public.blob.vercel-storage.com/Riviera_Maxmove-OYpQhy9uHTcLbmTBLGh8D7e3j8V5MU.png"
                alt="Maxmove Delivery Service"
                width="600"
                height="200"
                className="w-full h-auto rounded-lg"
                style={{
                  maxWidth: '100%',
                  display: 'block',
                  outline: 'none',
                  border: 'none',
                  objectFit: 'cover',
                  objectPosition: 'center'
                }}
              />
            </Section>
            
            <Section className="mt-[32px]">
              <Heading className="text-[24px] font-bold text-gray-800 mb-[16px]">
                Welcome to Maxmove
              </Heading>
              
              <Text className="text-[16px] text-gray-600 mb-[24px]">
                Thank you for joining our waitlist! We've received your email address ({email}) and will keep you updated on our progress and launch date.
              </Text>
              
              <Text className="text-[16px] text-gray-600 mb-[24px]">
                We're working hard to create the <strong>best delivery platform in Germany</strong>.
              </Text>
              
              <Text className="text-[16px] text-gray-600 mb-[24px]">
                As a waitlist member, you'll be among the first to:
              </Text>
              
              <ul className="list-disc pl-[20px] mb-[24px]">
                <li className="text-[16px] text-gray-600">Get early access to our platform</li>
                <li className="text-[16px] text-gray-600">Receive exclusive launch offers</li>
                <li className="text-[16px] text-gray-600">Enjoy priority customer support</li>
              </ul>
              
              <Button
                className="bg-[#1c2d4f] text-white font-bold py-[12px] px-[20px] rounded-md no-underline text-center box-border"
                href="https://maxmove.de"
              >
                Learn More About Maxmove
              </Button>
              
              <Hr className="my-[32px] border-gray-200" />
              
              <Text className="text-[16px] text-gray-600 mb-[8px]">
                Stay connected:
              </Text>
              
              <Text className="text-[16px] text-gray-600 mb-[24px]">
                <Link href="https://x.com/maxmoveapp" className="text-blue-600 no-underline">X</Link> • 
                <Link href="https://www.linkedin.com/company/maxmove" className="text-blue-600 no-underline"> LinkedIn</Link> • 
                <Link href="https://www.instagram.com/maxmoveapp/" className="text-blue-600 no-underline"> Instagram</Link>
              </Text>
              
              <Text className="text-[16px] text-gray-600 mb-[8px]">
                Best regards,
              </Text>
              
              <Text className="text-[16px] font-bold text-gray-800 mb-[32px]">
                Max<br />
                Founder of Maxmove
              </Text>
            </Section>
            
            <Hr className="my-[16px] border-gray-200" />
            
            <Section>
              <Text className="text-[12px] text-gray-500 m-0">
                © {new Date().getFullYear()} Maxmove. All rights reserved.
              </Text>
              <Text className="text-[12px] text-gray-500 m-0">
                Eulenbergstr.37, 51065, Cologne Germany
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}