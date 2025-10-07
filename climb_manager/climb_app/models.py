from django.db import models

# Create your models here.
from django.db import models


class Area(models.Model):
    country = models.CharField(null=True, blank=True)
    name = models.CharField(null=True, blank=True)

    def __str__(self):
        return self.name


class NearestReference(models.Model):
    area = models.ForeignKey(Area, on_delete=models.CASCADE, null=True, blank=True)
    name = models.CharField(null=True, blank=True)

    def __str__(self):
        return self.name


class Route(models.Model):
    TYPE_CHOICES = [
        ("sport", "Sport"),
        ("semi-alpine", "Semi-alpine"),
        ("alpine", "Alpine"),
        ("trad", "Trad"),
    ]

    class Prio(models.IntegerChoices):
        LOW = 3, "Low"
        MEDIUM = 2, "Medium"
        HIGH = 1, "High"

    name = models.CharField()
    nearest_reference = models.ForeignKey(
        NearestReference, on_delete=models.CASCADE, null=True, blank=True
    )
    grade = models.CharField(null=True, blank=True)
    type = models.CharField(choices=TYPE_CHOICES)
    prio = models.IntegerField(choices=Prio.choices, null=True, blank=True)
    more_info_at = models.CharField(null=True, blank=True)
    length = models.IntegerField(null=True, blank=True)
    done = models.BooleanField(null=True, blank=True)

    def __str__(self):
        return self.name


class Climb(models.Model):

    route = models.ForeignKey(Route, on_delete=models.CASCADE)
    date = models.DateField()
    climbers = models.ManyToManyField("Climber", related_name="climbs")
    comment = models.CharField(
        null=True,
        blank=True,
    )

    def __str__(self):
        return f"{self.route} on {self.date}"


class Climber(models.Model):

    name = models.CharField()

    def __str__(self):
        return f"{self.name}"
