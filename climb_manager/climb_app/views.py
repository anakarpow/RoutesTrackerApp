from django.shortcuts import render
from django.http import HttpResponse
from django.shortcuts import get_object_or_404, render
from .models import Route,Climber, Area,NearestReference


def index(request):
    return HttpResponse("Hi Diocane")


def all_routes(request):
    all_routes = Route.objects.all()
    return render(request, "list_routes.html", context={"routes": all_routes})


def single_route(request,route_id):
    single_route =  get_object_or_404(Route, id=route_id) 
    return render(request, "single_route.html", context={"route": single_route})


def single_climber(request,climber_name):
    single_climber =  get_object_or_404(Climber, name=climber_name) 
    return render(request, "single_climber.html", context={"climber": single_climber})


def single_area(request,area_id):
    single_area =  get_object_or_404(Area, id=area_id) 
    return render(request, "single_area.html", context={"area": single_area})

def single_reference(request,ref_id):
    single_ref =  get_object_or_404(NearestReference, id=ref_id) 
    return render(request, "single_reference.html", context={"reference": single_ref})