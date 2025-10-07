from django.urls import path

from climb_app import views

urlpatterns = [
    path("", views.index, name="index"),
    path("list_routes/", views.all_routes, name="list_routes"),
    path("routes/<int:route_id>/", views.single_route, name="single_route"),
    path("climbers/<str:climber_name>/", views.single_climber, name="single_climber"),
    path("areas/<int:area_id>/", views.single_area, name="single_area"),
    path("references/<int:ref_id>/", views.single_reference, name="single_reference"),
]
