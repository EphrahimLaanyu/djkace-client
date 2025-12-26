// src/components/SEO.jsx
import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, url }) => {
    const siteTitle = "DJ Kace | Top DJ in Kenya";
    const defaultDescription = "Deejay Kace is Kenya's premier DJ, specializing in Afrobeat, Hip Hop, and Dancehall mixes. Book the best DJ in Nairobi for events and weddings.";
    const siteUrl = "https://djkace.com"; // REPLACE WITH YOUR ACTUAL DOMAIN

    // This JSON-LD data tells Google to create those "Sitelinks" you saw in the screenshot
    const schemaData = {
        "@context": "https://schema.org",
        "@type": "Person",
        "name": "DJ Kace",
        "alternateName": ["Deejay Kace", "Kace"],
        "url": siteUrl,
        "jobTitle": "DJ",
        "image": `${siteUrl}/path-to-your-profile-image.jpg`, // Add a link to your photo
        "sameAs": [
            "https://www.instagram.com/deejaykace",
            "https://twitter.com/deejaykace",
            // Add other social links here
        ],
        "description": "Professional DJ based in Nairobi, Kenya."
    };

    // This specifically targets the "Sitelinks" structure
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

            {/* Open Graph (Facebook/WhatsApp Previews) */}
            <meta property="og:type" content="website" />
            <meta property="og:title" content={title || siteTitle} />
            <meta property="og:description" content={description || defaultDescription} />
            <meta property="og:url" content={url || siteUrl} />
            
            {/* Structured Data Scripts (The Secret Sauce) */}
            <script type='application/ld+json'>{JSON.stringify(schemaData)}</script>
            <script type='application/ld+json'>{JSON.stringify(navigationSchema)}</script>
        </Helmet>
    );
};

export default SEO;