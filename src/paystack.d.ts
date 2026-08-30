declare module '@paystack/inline-js' {
  interface PaystackOptions {
    key: string;
    email: string;
    amount: number;
    currency?: string;
    ref?: string;
    metadata?: {
      custom_fields?: Array<{
        display_name: string;
        variable_name: string;
        value: string;
      }>;
    };
    onSuccess?: (transaction: any) => void;
    onClose?: () => void;
  }

  interface PaystackInstance {
    openIframe: () => void;
  }

  function setup(options: PaystackOptions): PaystackInstance;
  
  export default { setup };
}
