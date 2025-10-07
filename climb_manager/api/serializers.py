from rest_framework import serializers
from climb_app.models import Area, NearestReference, Route, Climb, Climber


class AreaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Area
        fields = "__all__"


class NearestReferenceSerializer(serializers.ModelSerializer):
    area = AreaSerializer(read_only=True)

    class Meta:
        model = NearestReference
        fields = "__all__"


class ClimberSerializer(serializers.ModelSerializer):
    class Meta:
        model = Climber
        fields = "__all__"


class ClimbSerializer(serializers.ModelSerializer):
    climbers = ClimberSerializer(many=True, read_only=True)
    climbers = ClimberSerializer(many=True, read_only=True, source="climber_set")
    class Meta:
        model = Climb
        fields = "__all__"


class RouteSerializer(serializers.ModelSerializer):
    nearest_reference = NearestReferenceSerializer(read_only=True)
    climbs = ClimbSerializer(many=True, read_only=True, source="climb_set")

    class Meta:
        model = Route
        fields = "__all__"
        extra_fields = ["climbs"]
