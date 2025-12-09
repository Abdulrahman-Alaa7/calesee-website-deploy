type LocaleSeo = {
  title: string;
  description: string;
  keywords: string[];
};

type SeoMetadata = {
  privacy: {
    ar: LocaleSeo;
    en: LocaleSeo;
  };
  refund: {
    ar: LocaleSeo;
    en: LocaleSeo;
  };
  shipping: {
    ar: LocaleSeo;
    en: LocaleSeo;
  };
  terms: {
    ar: LocaleSeo;
    en: LocaleSeo;
  };
  search: {
    ar: LocaleSeo;
    en: LocaleSeo;
  };
  checkout: {
    ar: LocaleSeo;
    en: LocaleSeo;
  };
  bag: {
    ar: LocaleSeo;
    en: LocaleSeo;
  };
  wishlist: {
    ar: LocaleSeo;
    en: LocaleSeo;
  };
  categories: {
    ar: LocaleSeo;
    en: LocaleSeo;
  };
};

const seoMetadata: SeoMetadata = {
  privacy: {
    ar: {
      title: "سياسة الخصوصية | Calesee",
      description:
        "اطلع على سياسة الخصوصية في Calesee. نحن ملتزمون بحماية بياناتك وضمان تجربتك الآمنة.",
      keywords: [
        "سياسة الخصوصية",
        "Calesee",
        "كالسِي",
        "حماية البيانات",
        "تسوق آمن",
        "أحذية",
        "صنادل",
      ],
    },
    en: {
      title: "Calesee | Privacy Policy",
      description:
        "Read Calesee’s privacy policy. Learn how we protect your personal data and keep your shopping experience safe.",
      keywords: [
        "Calesee",
        "privacy policy",
        "data protection",
        "secure shopping",
        "shoes",
        "sandals",
        "online store",
      ],
    },
  },
  refund: {
    ar: {
      title: "سياسة الاسترداد والاسترجاع | Calesee",
      description:
        "تعرف على سياسة الاسترداد والاسترجاع في Calesee. نحن نضمن رضاك عن جودة أحذيتنا.",
      keywords: [
        "سياسة الاسترداد",
        "استرجاع أحذية",
        "Calesee",
        "كالسِي",
        "تسوق موثوق",
        "جودة الأحذية",
      ],
    },
    en: {
      title: "Calesee | Refund & Return Policy",
      description:
        "Learn about Calesee’s refund and return policy. We work to ensure you’re satisfied with the quality and fit of your shoes.",
      keywords: [
        "Calesee",
        "refund policy",
        "return policy",
        "shoe returns",
        "trusted shopping",
        "high quality shoes",
      ],
    },
  },
  shipping: {
    ar: {
      title: "سياسة الشحن والتوصيل | Calesee",
      description:
        "اطلع على سياسة الشحن والتوصيل في Calesee. نوفر توصيل سريع وموثوق لأحذيتك وصنادلك إليك!",
      keywords: [
        "سياسة الشحن",
        "توصيل أحذية",
        "Calesee",
        "كالسِي",
        "شحن سريع",
        "تسوق اونلاين",
      ],
    },
    en: {
      title: "Calesee | Shipping & Delivery",
      description:
        "Read about Calesee’s shipping and delivery policy. We offer fast and reliable delivery for your shoes and sandals.",
      keywords: [
        "Calesee",
        "shipping policy",
        "delivery",
        "fast shipping",
        "shoe delivery",
        "online shopping",
      ],
    },
  },
  terms: {
    ar: {
      title: "شروط الخدمة | Calesee",
      description:
        "اطلع على شروط الخدمة في Calesee. نحن ملتزمون بتقديم تجربة تسوق موثوقة وسهلة.",
      keywords: [
        "شروط الخدمة",
        "Calesee",
        "كالسِي",
        "تسوق اونلاين",
        "أحذية",
        "صنادل",
        "تجربة موثوقة",
      ],
    },
    en: {
      title: "Calesee | Terms of Service",
      description:
        "Read Calesee’s terms of service. Understand the rules that keep your online shopping clear and safe.",
      keywords: [
        "Calesee",
        "terms of service",
        "terms and conditions",
        "online shopping",
        "shoes",
        "sandals",
      ],
    },
  },
  categories: {
    ar: {
      title: "الأقسام | Calesee",
      description:
        "اكتشف جميع أقسام الأحذية في Calesee. تسوّق بسهولة بين أحدث الموديلات من الأحذية، الصنادل، البوت، والحقائب المختارة بعناية.",
      keywords: [
        "Calesee",
        "كالسِي",
        "أقسام الأحذية",
        "تسوق أحذية",
        "أحذية رجالي",
        "أحذية حريمي",
        "أحذية أطفال",
        "صنادل",
        "بوت",
        "متجر أحذية",
        "تسوق اونلاين",
      ],
    },
    en: {
      title: "Calesee | Categories",
      description:
        "Explore all shoe categories at Calesee. Easily shop the latest models including shoes, sandals, boots, and carefully selected accessories.",
      keywords: [
        "Calesee",
        "shoe categories",
        "online shoe store",
        "men shoes",
        "women shoes",
        "kids shoes",
        "sandals",
        "boots",
        "online shopping",
      ],
    },
  },
  search: {
    ar: {
      title: "البحث عن المنتجات | Calesee",
      description:
        "ابحث عن أحذية وصنادل Calesee المفضلة لديك بسهولة، واستخدم فلاتر متقدمة للوصول إلى ما يناسب ذوقك.",
      keywords: [
        "Calesee",
        "كالسِي",
        "بحث",
        "بحث عن أحذية",
        "أحذية",
        "صنادل",
        "تسوق اونلاين",
        "فلترة المنتجات",
      ],
    },
    en: {
      title: "Calesee | Search Products",
      description:
        "Search Calesee shoes and sandals with advanced filters to quickly find the perfect style and size for you.",
      keywords: [
        "Calesee",
        "product search",
        "shoe search",
        "sandals",
        "online shopping",
        "filters",
        "find products",
      ],
    },
  },
  bag: {
    ar: {
      title: "سلة التسوق | Calesee",
      description:
        "راجع محتويات سلة التسوق الخاصة بك في Calesee، وعدّل الكميات قبل إتمام عملية الشراء.",
      keywords: [
        "Calesee",
        "كالسِي",
        "سلة التسوق",
        "عربة التسوق",
        "شراء أحذية",
        "تسوق اونلاين",
      ],
    },
    en: {
      title: "Calesee | Shopping Bag",
      description:
        "Review the items in your Calesee shopping bag, update quantities, and get ready to complete your order.",
      keywords: [
        "Calesee",
        "shopping bag",
        "cart",
        "online shopping",
        "shoes",
        "sandals",
        "checkout",
      ],
    },
  },
  checkout: {
    ar: {
      title: "إتمام الطلب | Calesee",
      description:
        "أكمل عملية الدفع بأمان مع Calesee واستمتع بتجربة تسوق سهلة وسريعة.",
      keywords: [
        "Calesee",
        "كالسِي",
        "إتمام الطلب",
        "دفع اونلاين",
        "تسوق",
        "أحذية",
      ],
    },
    en: {
      title: "Calesee | Checkout",
      description:
        "Securely complete your order with Calesee and enjoy a smooth, fast checkout experience.",
      keywords: [
        "Calesee",
        "checkout",
        "secure payment",
        "online shopping",
        "shoes",
      ],
    },
  },
  wishlist: {
    ar: {
      title: "قائمة المفضلة | Calesee",
      description:
        "احتفظ بأحذيتك المفضلة في قائمة المفضلة على Calesee للرجوع إليها وشرائها لاحقًا.",
      keywords: [
        "Calesee",
        "كالسِي",
        "قائمة المفضلة",
        "منتجات مفضلة",
        "تسوق لاحقًا",
        "أحذية",
        "صنادل",
      ],
    },
    en: {
      title: "Calesee | Wishlist",
      description:
        "Save your favorite Calesee shoes and sandals to your wishlist so you can easily find and buy them later.",
      keywords: [
        "Calesee",
        "wishlist",
        "favorite products",
        "save for later",
        "shoes",
        "sandals",
      ],
    },
  },
};

export default seoMetadata;
