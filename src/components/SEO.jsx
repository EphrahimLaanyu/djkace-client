import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, url }) => {
    // 1. HARDCODED URLS (To eliminate logic errors)
    const siteUrl = "https://djkace-client.vercel.app";
    const imageUrl = "https://djkace-client.vercel.app/social-card.png"; // Direct link to your PNG

    const defaultDescription = "Deejay Kace is Kenya's premier DJ, specializing in Afrobeat, Hip Hop, and Dancehall mixes.";

    const schemaData = {
        "@context": "https://schema.org",
        "@type": "Person",
        "name": "DJ Kace",
        "url": siteUrl,
        "image": imageUrl,
        "sameAs": [
            "https://www.instagram.com/deejaykace",
            "https://www.youtube.com/@DeeJayKace"
        ],
        "description": defaultDescription
    };

    return (
        <Helmet>
            {/* Standard Tags */}
            <title>{title ? `${title} | DJ Kace` : "DJ Kace | Top DJ in Kenya"}</title>
            <meta name="description" content={description || defaultDescription} />
            <link rel="canonical" href={url || siteUrl} />

            {/* OPEN GRAPH (Crucial for WhatsApp) */}
            <meta property="og:type" content="website" />
            <meta property="og:title" content={title || "DJ Kace | Top DJ in Kenya"} />
            <meta property="og:description" content={description || defaultDescription} />
            <meta property="og:url" content={url || siteUrl} />
            
            {/* FORCE THE IMAGE */}
            <meta property="og:image" content={imageUrl} />
            <meta property="og:image:secure_url" content={imageUrl} />
            <meta property="og:image:type" content="image/png" />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={title || "DJ Kace"} />
            <meta name="twitter:description" content={description || defaultDescription} />
            <meta name="twitter:image" content={imageUrl} />

            <script type='application/ld+json'>{JSON.stringify(schemaData)}</script>
        </Helmet>
    );
};

export default SEO;