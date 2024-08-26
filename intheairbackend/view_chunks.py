import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'intheairbackend.settings')
django.setup()

from backend.models import FileChunk

all_chunks = FileChunk.objects.all()
for chunk in all_chunks:
    print(chunk.file, chunk.chunk_number, chunk.total_chunks)
