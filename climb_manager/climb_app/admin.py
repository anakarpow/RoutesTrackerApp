from django.contrib import admin

# Register your models here.
from .models import (
    Area,
    Route,
    Climb,
    Climber,
    NearestReference,
)
from django.contrib import admin
from import_export import resources

# admin.py
from import_export.admin import ImportExportModelAdmin

class RouteResource(resources.ModelResource):
    class Meta:
        model = Route

   

class RouteAdmin(ImportExportModelAdmin):
    resource_class = RouteResource

admin.site.register(Route, RouteAdmin)


class ClimbInline(admin.TabularInline):
    model = Climb.climbers.through
    extra = 1


class ClimberAdmin(admin.ModelAdmin):
    inlines = [ClimbInline]


admin.site.register(Area)
admin.site.register(Climb)
admin.site.register(NearestReference)

admin.site.register(Climber, ClimberAdmin)
