from django.contrib import admin
from .models import Item

@admin.register(Item)
class ItemAdmin(admin.ModelAdmin):
    """
    Admin configuration for the Item model.
    """
    list_display = ('name', 'description', 'created_at')
    list_filter = ('completed',)
    search_fields = ('title', 'description')