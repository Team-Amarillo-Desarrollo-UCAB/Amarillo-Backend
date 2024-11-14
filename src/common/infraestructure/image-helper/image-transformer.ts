export class ImageTransformer
{

    constructor ()
    {
    }

    async base64ToFile ( base64: string ): Promise<File>
    {
        const arr = base64.split( ',' )
        const bstr = atob( arr[ arr.length - 1 ] )
        let n = bstr.length
        const u8arr = new Uint8Array( n )
        while ( n-- )
        {
            u8arr[ n ] = bstr.charCodeAt( n )
        }
        const file = new File( [ u8arr ], "image.png", { type: "image"} )
        return file
    }

}