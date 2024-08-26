from django.http import JsonResponse, HttpResponseBadRequest
from django.views.decorators.csrf import csrf_exempt
from django.core.files.base import ContentFile
from django.db import transaction
from .models import UploadedFile, FileChunk
import os
import logging
import traceback
from django.conf import settings
from django.db.models import Sum


logger = logging.getLogger(__name__)

def hello_world(request):
    return JsonResponse({'message': 'Hello World'})

@csrf_exempt
@transaction.atomic
def upload_chunk(request):
    if request.method == 'POST':
        try:
            chunk = request.FILES.get('chunk')
            chunk_index = int(request.POST.get('chunkIndex', -1))
            total_chunks = int(request.POST.get('totalChunks', -1))
            file_name = request.POST.get('fileName', '')

            if chunk is None or chunk_index == -1 or total_chunks == -1 or not file_name:
                return HttpResponseBadRequest('Missing required parameters')

            uploaded_file, created = UploadedFile.objects.get_or_create(name=file_name)

            file_chunk, created = FileChunk.objects.update_or_create(
                file=uploaded_file,
                chunk_number=chunk_index,
                defaults={'total_chunks': total_chunks, 'chunk_data': chunk.read()}
            )

            if chunk_index == total_chunks - 1:
                total_size = 0
                BASE_DIR = os.path.dirname(os.path.abspath(__file__))
                file_path = os.path.join(BASE_DIR, 'media', file_name)

                with open(file_path, 'wb') as destination:
                    for i in range(total_chunks):
                        chunk_file = FileChunk.objects.get(file=uploaded_file, chunk_number=i).chunk_data
                        total_size += len(chunk_file)
                        destination.write(chunk_file)

                uploaded_file.size = total_size
                uploaded_file.is_complete = True
                uploaded_file.save()

            return JsonResponse({'status': 'chunk uploaded'})

        except Exception as e:
            error_message = f'Error: {str(e)}'
            logger.error(error_message)
            return HttpResponseBadRequest(error_message)

    return HttpResponseBadRequest('Invalid request method')

def assemble_file(file_name, total_chunks):
    upload_dir = os.path.join(settings.MEDIA_ROOT, file_name)
    full_file_path = os.path.join(upload_dir, file_name)
    
    # Ouvrir le fichier final en mode écriture
    with open(full_file_path, 'wb') as full_file:
        for i in range(total_chunks):
            chunk_file_path = os.path.join(upload_dir, f'chunk_{i}')
            with open(chunk_file_path, 'rb') as chunk_file:
                full_file.write(chunk_file.read())
    
    # Nettoyer les fichiers de chunks
    for i in range(total_chunks):
        os.remove(os.path.join(upload_dir, f'chunk_{i}'))


def list_files(request):
    if request.method == 'GET':
        files = UploadedFile.objects.all().values('id', 'name', 'size', 'upload_date', 'is_complete')
        return JsonResponse(list(files), safe=False)
    return JsonResponse({'error': 'Invalid request method.'}, status=400)

@csrf_exempt
def delete_file(request, file_id):
    if request.method == 'DELETE':
        try:
            file = UploadedFile.objects.get(id=file_id)
            file.delete()
            return JsonResponse({'status': 'File deleted successfully'})
        except UploadedFile.DoesNotExist:
            return JsonResponse({'error': 'File not found'}, status=404)
    return JsonResponse({'error': 'Invalid request method.'}, status=400)


