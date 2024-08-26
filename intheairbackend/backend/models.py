from django.db import models

class UploadedFile(models.Model):
    name = models.CharField(max_length=255)
    size = models.BigIntegerField(null=True, blank=True)
    upload_date = models.DateTimeField(auto_now_add=True)
    is_complete = models.BooleanField(default=False)

    def __str__(self):
        return self.name

class FileChunk(models.Model):
    file = models.ForeignKey(UploadedFile, on_delete=models.CASCADE, related_name='chunks')
    chunk_number = models.IntegerField()
    total_chunks = models.IntegerField()
    chunk_data = models.BinaryField()

    class Meta:
        unique_together = ('file', 'chunk_number')
