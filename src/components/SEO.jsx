// src/components/SEO.jsx
import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, url, image }) => {
    // 1. GLOBAL CONFIGURATION
    const siteTitle = "DJ Kace | Top DJ in Kenya";
    const defaultDescription = "Deejay Kace is Kenya's premier DJ, specializing in Afrobeat, Hip Hop, and Dancehall mixes. Book the best DJ in Nairobi for events and weddings.";
    const siteUrl = "https://deejaykace.co.ke"; 

    // 2. IMAGE HANDLING (For WhatsApp/Social Previews)
    // This looks for 'social-card.svg' in your public folder by default.
    // If you pass a specific image (e.g. for a mix), it uses that instead.
    const validImage = image 
        ? (image.startsWith('http') ? image : `${siteUrl}${image}`) 
        : `${siteUrl}/social-card.svg`;

    // 3. SCHEMA DATA (For Google "Sitelinks")
    const schemaData = {
        "@context": "https://schema.org",
        "@type": "Person",
        "name": "DJ Kace",
        "alternateName": ["Deejay Kace", "Kace"],
        "url": siteUrl,
        "jobTitle": "DJ",
        "image": validImage, // Links to your SVG
        "sameAs": [
            "https://www.instagram.com/deejaykace",
            "https://twitter.com/deejaykace",
            "https://www.tiktok.com/@dj.kace",
            "https://www.youtube.com/@DeeJayKace"
        ],
        "description": "Professional DJ based in Nairobi, Kenya."
    };

    // 4. NAVIGATION SCHEMA
    const navigationSchema = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "itemListElement": [
            {
                "@type": "SiteNavigationElement",
                "position": 1,
                "name": "Latest Mixes",
                "description": "Download and stream the latest DJ Kace mixes.",
                "url": `${siteUrl}/mixes`
            },
            {
                "@type": "SiteNavigationElement",
                "position": 2,
                "name": "Book DJ Kace",
                "description": "Contact information for bookings and events in Kenya.",
                "url": `${siteUrl}/contacts`
            },
            {
                "@type": "SiteNavigationElement",
                "position": 3,
                "name": "About Kace",
                "description": "Learn about Nairobi's top DJ.",
                "url": `${siteUrl}/about`
            }
        ]
    };

    return (
        <Helmet>
            {/* Standard Meta Tags */}
            <title>{title ? `${title} | DJ Kace` : siteTitle}</title>
            <meta name="description" content={description || defaultDescription} />
            <meta name="keywords" content="DJ Kace, Deejay Kace, DJs in Kenya, Nairobi DJ, Best DJ in Kenya, Kenyan Mixes, Afrobeat DJ" />
            <link rel="canonical" href={url || siteUrl} />

            {/* Open Graph (WhatsApp / Facebook) */}
            <meta property="og:type" content="website" />
            <meta property="og:title" content={title || siteTitle} />
            <meta property="og:description" content={description || defaultDescription} />
            <meta property="og:url" content={url || siteUrl} />
            
            {/* The SVG Image Link */}
            <meta property="og:image" content={validImage} />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="1200" />

            {/* Twitter Card */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={title || siteTitle} />
            <meta name="twitter:description" content={description || defaultDescription} />
            <meta name="twitter:image" content={validImage} />

            {/* Structured Data Scripts */}
            <script type='application/ld+json'>{JSON.stringify(schemaData)}</script>
            <script type='application/ld+json'>{JSON.stringify(navigationSchema)}</script>
        </Helmet>
    );
};

export default SEO;