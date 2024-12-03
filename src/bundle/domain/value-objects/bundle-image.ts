import { IValueObject } from "src/common/domain/value-object/value-object.interface";
import { InvalidBundleImageException } from "../exceptions/invalid-bundle-image.exception";

export class BundleImage implements IValueObject<BundleImage> {
    private readonly image: string;

    private constructor(image: string) {
        if (!image || image.trim() === "") {
            throw new InvalidBundleImageException("La propiedad de imagen del combo no es válida.");
        }
        this.image = image;
    }

    public static create(image: string): BundleImage {
        return new BundleImage(image);
    }

    public equals(other: BundleImage): boolean {
        if (!other) return false;
        return this.image === other.image;
    }

    get Value(): string {
        return this.image;
    }
}
