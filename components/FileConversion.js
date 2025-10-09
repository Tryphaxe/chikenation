import React from 'react'

export default function FileConversion(link) {
    const match = link.match(/(?:\/d\/|id=)([a-zA-Z0-9_-]{10,})/);
    const fileId = match ? match[1] : null;

    if (!fileId) return null;
    return `https://lh3.googleusercontent.com/d/${fileId}`
}
