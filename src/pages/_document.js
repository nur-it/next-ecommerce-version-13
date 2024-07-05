import Document, { Head, Html, Main, NextScript } from "next/document";

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const { cookies } = ctx.req;

    let seo;
    if (cookies._seo) {
      seo = JSON.parse(cookies._seo);
    }

    const initialProps = await Document.getInitialProps(ctx);

    return { ...initialProps, seo };
  }

  render() {
    const setting = this.props.seo;
    const seo = setting;
    // console.log("seo", seo);

    return (
      <Html lang="en">
        <Head>
          <link rel="icon" href={seo?.favicon || "/favicon.png"} />
          <meta
            property="og:title"
            content={
              seo?.meta_title ||
              "Kachabazar - React Grocery & Organic Food Store e-commerce Template"
            }
          />
          <meta property="og:type" content="eCommerce Website" />
          <meta
            property="og:description"
            content={
              seo?.meta_description ||
              "React Grocery & Organic Food Store e-commerce Template"
            }
          />
          <meta
            name="keywords"
            content={seo?.meta_keywords || "ecommenrce online store"}
          />
          <meta
            property="og:url"
            content={seo?.meta_url || "https://kachabazar-store.vercel.app/"}
          />
          <meta
            property="og:image"
            content={
              seo?.meta_img ||
              "https://res.cloudinary.com/ahossain/image/upload/v1700383437/CloudClever_l6mkvi.png"
            }
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
