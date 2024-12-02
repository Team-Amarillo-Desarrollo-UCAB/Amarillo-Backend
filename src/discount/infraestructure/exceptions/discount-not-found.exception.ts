export class DiscountNotFoundException extends Error {
    constructor(message: string = 'Discount not found') {
      super(message);
      this.name = 'DiscountNotFoundException';
    }
  }
  