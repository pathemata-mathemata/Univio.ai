export default function SEOStructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://univio.ai/#website",
        "url": "https://univio.ai/",
        "name": "UniVio - AI-Powered Course Planning",
        "description": "Navigate your community college to university transfer journey with intelligent course planning, real-time requirements analysis, and personalized recommendations.",
        "publisher": {
          "@id": "https://univio.ai/#organization"
        },
        "inLanguage": "en-US"
      },
      {
        "@type": "Organization",
        "@id": "https://univio.ai/#organization",
        "name": "UniVio",
        "alternateName": "UniVio.ai",
        "url": "https://univio.ai/",
        "logo": {
          "@type": "ImageObject",
          "@id": "https://univio.ai/#logo",
          "url": "https://univio.ai/images/univio-logo.png",
          "contentUrl": "https://univio.ai/images/univio-logo.png",
          "width": 192,
          "height": 192,
          "caption": "UniVio Logo"
        },
        "image": {
          "@id": "https://univio.ai/#logo"
        },
        "description": "AI-powered course planning platform for community college students transferring to universities.",
        "foundingDate": "2024",
        "areaServed": "US",
        "serviceType": "Educational Technology",
        "knowsAbout": [
          "College Transfer",
          "Course Planning", 
          "Academic Advising",
          "University Requirements",
          "Community College",
          "ASSIST.org Integration"
        ]
      },
      {
        "@type": "WebApplication",
        "@id": "https://univio.ai/#webapp",
        "name": "UniVio Course Planning Platform",
        "url": "https://univio.ai/",
        "description": "AI-powered platform that helps community college students plan their transfer journey to universities with intelligent course recommendations and real-time requirements analysis.",
        "applicationCategory": "EducationalApplication",
        "operatingSystem": "Web Browser",
        "browserRequirements": "Modern web browser with JavaScript enabled",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD",
          "availability": "https://schema.org/InStock"
        },
        "featureList": [
          "AI-powered course recommendations",
          "Real-time transfer requirements analysis", 
          "ASSIST.org integration",
          "Personalized academic planning",
          "Progress tracking",
          "Deadline management"
        ]
      },
      {
        "@type": "FAQPage",
        "@id": "https://univio.ai/#faq",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What is UniVio and how does it help with college transfers?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "UniVio is an AI-powered course planning platform designed specifically for California community college students planning to transfer to UC and CSU universities. It provides intelligent course recommendations, real-time requirements analysis through ASSIST.org integration, and personalized academic planning to ensure successful university transfer."
            }
          },
          {
            "@type": "Question", 
            "name": "How do you protect my personal data and privacy?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "We take your privacy seriously and implement industry-standard security measures. Your personal information is encrypted and securely stored. We never sell your data to third parties. We only use your academic information to provide personalized course recommendations and track your progress. You can request to delete your account and all associated data at any time."
            }
          },
          {
            "@type": "Question", 
            "name": "Is UniVio free to use?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "UniVio offers a free tier that includes basic course planning features and access to ASSIST.org integration. Premium features like advanced AI recommendations, detailed progress tracking, and priority support are available through our paid plans. We believe every student should have access to quality transfer planning tools."
            }
          },
          {
            "@type": "Question", 
            "name": "Which California community colleges and universities are supported?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "UniVio supports all California community colleges and provides transfer pathways to all UC and CSU universities. Our platform integrates directly with ASSIST.org to ensure you have access to the most current transfer requirements and articulation agreements for your specific college and target university."
            }
          },
          {
            "@type": "Question", 
            "name": "How accurate are the AI course recommendations?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Our AI recommendations are based on official ASSIST.org data, historical transfer patterns, and current university requirements. While we strive for high accuracy, we always recommend confirming your course plan with your academic advisor. Our platform serves as a powerful planning tool to complement, not replace, professional academic counseling."
            }
          },
          {
            "@type": "Question", 
            "name": "How do I get started with UniVio?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Getting started is simple! Create a free account, input your current community college and intended major, and tell us which UC or CSU universities you're interested in. Our AI will analyze your goals and provide a personalized course plan. You can then track your progress and get updates as requirements change."
            }
          }
        ]
      }
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
} 