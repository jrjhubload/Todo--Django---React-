from rest_framework import serializers
from .models import Item

class ItemSerializer(serializers.ModelSerializer):
    """
    Serializer for the Todo model to convert model instances to JSON and vice-versa.
    """
    class Meta:
        model = Item
        fields = '__all__' # Include all fields from the Todo model