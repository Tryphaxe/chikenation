import React from 'react'

export default function FileConversion(link) {
    const match = link.match(/\/d\/([a-zA-Z0-9_-]+)\//);
    if (!match) return null;
    const fileId = match[1];
    return `https://drive.google.com/uc?export=view&id=${fileId}`
}
