import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File
    const recordId = formData.get('recordId') as string 

    if (!file) return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })

    
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const fileName = `${Date.now()}-${file.name}`

    const { error: uploadError } = await supabase.storage
      .from('uploads')
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: false,
      })

    if (uploadError) throw uploadError

   
    const { data: publicUrlData } = supabase.storage.from('uploads').getPublicUrl(fileName)
    const publicUrl = publicUrlData.publicUrl

    
    const backendRes = await fetch('http://localhost:8080/api/vehicle/updateImage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: recordId,
        imageUrl: publicUrl,
      }),
    })

    if (!backendRes.ok) throw new Error('Failed to update SQL Server')

    return NextResponse.json({ success: true, imageUrl: publicUrl })
  } catch (err: any) {
    console.error('Upload error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
