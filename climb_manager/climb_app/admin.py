from django.contrib import admin

from .models import (
    Area,
    Route,
    Climb,
    Climber,
    NearestReference,
)
from django.contrib import admin
from import_export import resources


class RouteResource(resources.ModelResource):
    class Meta:
        model = Route



admin.site.register(Route)


class ClimbInline(admin.TabularInline):
    model = Climb.climbers.through
    extra = 1


class ClimberAdmin(admin.ModelAdmin):
    inlines = [ClimbInline]


admin.site.register(Area)
admin.site.register(Climb)
admin.site.register(NearestReference)
admin.site.register(Climber, ClimberAdmin)
