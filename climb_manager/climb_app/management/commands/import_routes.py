import csv
from django.core.management.base import BaseCommand
from climb_app.models import Area, NearestReference, Route


class Command(BaseCommand):
    help = "Import routes from a CSV file."

    def add_arguments(self, parser):
        parser.add_argument("csv_file", type=str, help="Path to the CSV file to import")

    def handle(self, *args, **options):
        csv_file = options["csv_file"]
        try:
            f = open(csv_file, newline="", encoding="utf-8")
            reader = csv.DictReader(f, delimiter=",")
        except UnicodeDecodeError:
            f = open(csv_file, newline="", encoding="cp1252")
            reader = csv.DictReader(f, delimiter="\t")
        count = 0
        first = True
        for row in reader:
            if first:
                self.stdout.write(f"CSV columns: {list(row.keys())}")
                self.stdout.write(f"Sample row: {row}")
                first = False
            area_name = row.get("Area")
            ref_name = row.get("Nearest hut/Reference")
            route_type = row.get("Type")
            # Map type values
            if route_type:
                t = route_type.strip().lower()
                if t == "sportclimb":
                    route_type = "Sport"
                elif t == "climb":
                    route_type = "Normal route"
            name = row.get("Name")
            grade = row.get("Grade")
            prio = row.get("Prio")
            link = row.get("Link")
            notes = row.get("notes")
            # Accept both 'done' and 'DONE' (case-insensitive)
            done = row.get("done") or row.get("DONE")
            length = row.get("length")
            comments = row.get("comments")
            year = row.get("year")

            if not name:
                continue  # Skip rows with no route name
            area, _ = Area.objects.get_or_create(name=area_name)
            ref, _ = NearestReference.objects.get_or_create(name=ref_name, area=area)

            def parse_done(val):
                if not val:
                    return False
                v = val.strip().lower()
                return v in ["1", "true", "yes", "y", "done"]

            route, created = Route.objects.get_or_create(
                name=name,
                defaults={
                    "nearest_reference": ref,
                    "type": route_type,
                    "grade": grade,
                    "prio": prio or None,
                    "more_info_at": link,
                    "length": length or None,
                    "done": parse_done(done),
                },
            )

            if not created:
                # Update fields if already exists
                route.nearest_reference = ref
                route.type = route_type
                route.grade = grade
                route.prio = prio or None
                route.more_info_at = link
                route.length = length or None
                route.done = parse_done(done)
                route.save()

            # Handle comments/notes - use the correct field name 'comment'
            comment_value = comments or notes
            if comment_value:
                route.comment = comment_value
                route.save()
            count += 1
