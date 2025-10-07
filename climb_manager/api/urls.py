from rest_framework.routers import DefaultRouter
from .views import AreaViewSet, NearestReferenceViewSet, RouteViewSet, ClimbViewSet, ClimberViewSet

router = DefaultRouter()
router.register(r'areas', AreaViewSet)
router.register(r'references', NearestReferenceViewSet)
router.register(r'routes', RouteViewSet)
router.register(r'climbs', ClimbViewSet)
router.register(r'climbers', ClimberViewSet)


urlpatterns = router.urls