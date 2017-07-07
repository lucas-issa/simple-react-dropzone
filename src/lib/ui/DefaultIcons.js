import React from 'react';


// const htmlDeleteIcon = renderToStaticMarkup(<DeleteIcon />);
// const htmlDeleteIcon = `<svg style="display:inline-block;color:rgba(0, 0, 0, 0.87);fill:currentColor;height:24px;width:24px;user-select:none;transition:all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms;mui-prepared:;" viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"></path></svg>`;
const htmlDeleteIcon = `<svg style="display:inline-block;color:rgba(0, 0, 0, 0.87);fill:currentColor;height:24px;width:24px;user-select:none;" viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"></path></svg>`;

// const htmlDeleteForeverIcon = renderToStaticMarkup(<DeleteForeverIcon />);
// const htmlDeleteForeverIcon = `<svg style="display:inline-block;color:rgba(0, 0, 0, 0.87);fill:currentColor;height:24px;width:24px;user-select:none;transition:all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms;mui-prepared:;" viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zm2.46-7.12l1.41-1.41L12 12.59l2.12-2.12 1.41 1.41L13.41 14l2.12 2.12-1.41 1.41L12 15.41l-2.12 2.12-1.41-1.41L10.59 14l-2.13-2.12zM15.5 4l-1-1h-5l-1 1H5v2h14V4z"></path></svg>`;
const htmlDeleteForeverIcon = `<svg style="display:inline-block;color:rgba(0, 0, 0, 0.87);fill:currentColor;height:24px;width:24px;user-select:none;" viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zm2.46-7.12l1.41-1.41L12 12.59l2.12-2.12 1.41 1.41L13.41 14l2.12 2.12-1.41 1.41L12 15.41l-2.12 2.12-1.41-1.41L10.59 14l-2.13-2.12zM15.5 4l-1-1h-5l-1 1H5v2h14V4z"></path></svg>`;

// const uploadIcon = (<UploadIcon />);
// const uploadIcon = `<svg style="display:inline-block;color:rgba(0, 0, 0, 0.87);fill:currentColor;height:24px;width:24px;user-select:none;transition:all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms;mui-prepared:;" viewBox="0 0 24 24"><path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z"></path></svg>`;
const uploadIconStyle = {
  display:'inline-block',
  color:'rgba(0, 0, 0, 0.87)',
  fill:'currentColor',
  height:24,
  width:24,
  userSelect:'none',
  // transition:'all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms',
  // muiPrepared:'',
};
const uploadIcon = (<svg style={uploadIconStyle} viewBox="0 0 24 24"><path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z"></path></svg>);



export const defaultIcons = {
  html: {
    deleteIcon: htmlDeleteIcon,
    deleteForeverIcon: htmlDeleteForeverIcon,
  },
  react: {
    uploadIcon,
  },
};