from django.contrib import admin
from .models import FileChunk

@admin.register(FileChunk)
class FileChunkAdmin(admin.ModelAdmin):
    list_display = ('file', 'chunk_number', 'total_chunks', 'chunk_data')
