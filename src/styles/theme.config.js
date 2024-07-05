import { createGlobalStyle } from 'styled-components';
// import { opacity } from 'tailwindcss/defaulttheme'
export const lightTheme = {
  // body: '#fff',
  // main: '#5C14DB',
  mainColor: '#FFFFFF',
  // accent: '#E5DE17',
  // accentColor: '#161616',
  // secondary: '#FFFFFF',
  // secondaryColor: '#343434',
  // dullColor: '#343434',
  // ternary: '#000000',
  // codeColor: '#D121C5',
  // bgColor: '#FF0000', red color
  // bgColor: '#ff0000',
  bgColor: '#10B981',
  fontColor: '#121212',
  //opacity:'0.5'
};

export const GlobalStyles = createGlobalStyle`
  * {
    box-sizing: border-box;
  }
  body {
    margin: 0;
    padding: 0;
    background: ${({ theme }) => theme.body};
    color: ${({ theme }) => theme.fontColor};
    font-family: sans-serif !important;
    font-weight: 400;
    font-style: normal;
    transition: all 0.50s linear;
  }
  input, textarea, button {font-family: inherit}
  .bg-emerald-500{
    background: ${({ theme }) => theme.bgColor};
  }
  .text-emerald-500{
    color: ${({ theme }) => theme.bgColor};
  }
  .border-emerald-300 {
    border-color:${({ theme }) => theme.bgColor};
  }

.bg-emerald-50{
    background-color:${({ theme }) => theme.bgColor}0d;
   
}
.bg-emerald-100{
  background-color:${({ theme }) => theme.bgColor}0d;
}

// .faq-btn:hover{
//   background-color:${({ theme }) => theme.fontColor};
// }

form button:hover{
   background-color:${({ theme }) => theme.fontColor};
}

.text-emerald-500 {
    color: ${({ theme }) => theme.bgColor};
}
.text-emerald-600 {
    color: ${({ theme }) => theme.bgColor};
}
.bg-emerald-700 {
    background-color: ${({ theme }) => theme.bgColor};
}
.text-emerald-600:hover {
    color: ${({ theme }) => theme.fontColor};
}
button .text-emerald-600 {
    color: ${({ theme }) => theme.mainColor};
}
.coupon button .text-emerald-600 {
  color: ${({ theme }) => theme.bgColor} !important;
}
.coupon button .text-emerald-600:hover {
  color: ${({ theme }) => theme.fontColor} !important;
}
.bg-indigo-50 .text-emerald-600 {
    color: ${({ theme }) => theme.bgColor};
}
.border-orange-500 {
    border-color: ${({ theme }) => theme.bgColor};
}  

nav button .text-emerald-600 {
    color: ${({ theme }) => theme.fontColor};
}
nav a:hover {
    color: ${({ theme }) => theme.bgColor};
}

a:hover{
  color: ${({ theme }) => theme.bgColor};
}

.group-hover:hover {
  color: ${({ theme }) => theme.bgColor};
}

.drawer-content button .text-emerald-600{
  color: ${({ theme }) => theme.bgColor};
}

.navBar a:hover{
  color: ${({ theme }) => theme.bgColor};
}
.navBar button:hover{
  color: ${({ theme }) => theme.bgColor};
}
.navBar span:hover{
  color: ${({ theme }) => theme.bgColor};
}
.navBar a div:hover{
  color: ${({ theme }) => theme.bgColor};
}
.shop-btn a:hover{
  background-color:${({ theme }) => theme.mainColor};
  color:${({ theme }) => theme.bgColor};
}

.fe-cat a:hover{
  color:${({ theme }) => theme.bgColor};
}
.fe-cat .group-hover:hover {
  color:${({ theme }) => theme.bgColor};
}

.rounded-lg {
  
}

.category-slider button.next, .category-slider button.prev {
  background-color: ${({ theme }) => theme.bgColor};
}
.category-slider button.next:hover, .category-slider button.prev:hover {
  background-color: ${({ theme }) => theme.fontColor};
}

.bg-green-500 {
  background-color: ${({ theme }) => theme.bgColor};
}
.bg-green-500:hover {
  background-color: ${({ theme }) => theme.fontColor};
}
.contact-btn{
  background-color: ${({ theme }) => theme.bgColor};
}
.contact-btn:hover{
  background-color: ${({ theme }) => theme.fontColor};
}

.footer a:hover {
  color: ${({ theme }) => theme.bgColor};
}
.drawer-content a:hover , .drawer-content a div:hover{
  color: ${({ theme }) => theme.bgColor};
}

.mob-footer-icon a:hover , .mob-footer-icon button:hover {
    color: ${({ theme }) => theme.fontColor};
  }


.invoice-btn button:hover{
  //background-color: ${({ theme }) => theme.fontColor};
  background-color:${({ theme }) => theme.bgColor}b3;
}


.login a:hover{
   color: ${({ theme }) => theme.fontColor};
}

.footer a:hover {
  color: ${({ theme }) => theme.fontColor};
}
.footer button:hover{
  color: ${({ theme }) => theme.fontColor};
}

.more-link:hover{
  color: ${({ theme }) => theme.fontColor};
}

`;
