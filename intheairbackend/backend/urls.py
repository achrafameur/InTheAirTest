from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import upload_chunk, hello_world, list_files, delete_file

urlpatterns = [
    path('hello/', hello_world, name='hello_world'),
    path('upload-chunk/', upload_chunk, name='upload_chunk'),
    path('list-files/', list_files, name='list_files'),
    path('delete-file/<int:file_id>/', delete_file, name='delete_file'),
]
