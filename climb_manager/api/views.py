# Create your views here.
from rest_framework import viewsets
from climb_app.models import Area, NearestReference, Route, Climb, Climber
from .serializers import (
    AreaSerializer,
    NearestReferenceSerializer,
    RouteSerializer,
    ClimbSerializer,
    ClimberSerializer,
)


class AreaViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Area.objects.all()
    serializer_class = AreaSerializer


class NearestReferenceViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = NearestReference.objects.all()
    serializer_class = NearestReferenceSerializer


class RouteViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Route.objects.all()
    serializer_class = RouteSerializer


class ClimbViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Climb.objects.all()
    serializer_class = ClimbSerializer


class ClimberViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Climber.objects.all()
    serializer_class = ClimberSerializer
