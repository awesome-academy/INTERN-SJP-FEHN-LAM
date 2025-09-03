import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';

export async function POST(request: Request) {
    try {
        const data = await request.formData();
        const file: File | null = data.get('imageFile') as unknown as File;

        if (!file) {
            return NextResponse.json({ success: false, message: 'No file uploaded.' }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const filename = `${Date.now()}-${file.name}`;

        const savePath = path.join(process.cwd(), 'public/images/products', filename);

        await writeFile(savePath, buffer);

        const publicUrl = `/images/products/${filename}`;

        return NextResponse.json({ success: true, url: publicUrl });

    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json({ success: false, message: 'Something went wrong.' }, { status: 500 });
    }
}
