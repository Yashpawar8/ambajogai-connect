import { Building2, GraduationCap, Users, BookOpen, Wifi, Trophy } from "lucide-react";

const departments = [
  { name: "Computer Science & Engineering", intake: 60 },
  { name: "Information Technology", intake: 60 },
  { name: "Electronics & Telecommunication", intake: 60 },
  { name: "Mechanical Engineering", intake: 60 },
  { name: "Civil Engineering", intake: 60 },
  { name: "Electrical Engineering", intake: 60 },
];

const faculty = [
  { name: "Dr. Khadakbhave Sir", role: "Principal" },
  { name: "Prof. Kulkarni Sir", role: "HOD — Computer Science" },
  { name: "Prof. Yerigiri Sir", role: "HOD — Electronics & Telecommunication" },
];

const facilities = [
  { icon: BookOpen, name: "Central Library", desc: "30,000+ books, digital journals, reading hall." },
  { icon: Wifi, name: "Wi-Fi Campus", desc: "Free high-speed Wi-Fi across academic blocks." },
  { icon: Trophy, name: "Sports Complex", desc: "Cricket, football, indoor games and gymnasium." },
  { icon: Users, name: "Hostels", desc: "Separate boys' & girls' hostels with mess facility." },
];

export function CollegeInfoTab() {
  return (
    <div className="space-y-8">
      <section className="rounded-xl border bg-card p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Building2 className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">MBES College of Engineering, Ambajogai</h2>
            <p className="mt-2 text-muted-foreground">
              Run by the Marathwada Bahuuddeshiya Education Society, MBES College of Engineering,
              Ambajogai is affiliated to Dr. Babasaheb Ambedkar Technological University (DBATU)
              and approved by AICTE. The institute is committed to producing skilled, ethical
              engineers serving the Marathwada region and beyond.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold"><GraduationCap className="h-5 w-5 text-primary" /> Departments & Courses</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          {departments.map((d) => (
            <div key={d.name} className="flex items-center justify-between rounded-lg border bg-card p-4">
              <span className="font-medium">{d.name}</span>
              <span className="text-sm text-muted-foreground">Intake: {d.intake}</span>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold"><Users className="h-5 w-5 text-primary" /> Key Faculty</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          {faculty.map((f) => (
            <div key={f.name} className="rounded-lg border bg-card p-4">
              <p className="font-medium">{f.name}</p>
              <p className="text-sm text-muted-foreground">{f.role}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h3 className="mb-3 text-lg font-semibold">Campus Facilities</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          {facilities.map((f) => (
            <div key={f.name} className="flex gap-3 rounded-lg border bg-card p-4">
              <f.icon className="h-6 w-6 shrink-0 text-primary" />
              <div>
                <p className="font-medium">{f.name}</p>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}