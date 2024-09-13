"use client"

import { ColumnDef } from "@tanstack/react-table"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Job = {
  id: string
  salary: "Any" | ">30k" | ">50k" | ">80k" | ">100k"
  location: "near me" | "remote" | "exact location" | "within 15km" | "within 30km" | "within 50km"
  date_of_posting: "All time" | "last 24h" | "last 3d" | "last 7d"
  work_experience: "any" | "internship" | "work remotely"
  type_of_employment: "full time" | "tempo" | "part time"
}

export const columns: ColumnDef<Job>[] = [
  {
    accessorKey: "salary",
    header: () => <div className="text-right">Salary</div>,
    cell: ({ row }) => {
      const salary = parseFloat(row.getValue("salary"))
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(salary)
 
      return <div className="text-right font-medium">{formatted}</div>
    },
  },
  {
    accessorKey: "location",
    header: "Location",
  },
  {
    accessorKey: "date_of_posting",
    header: "Date of Posting",
  },
  {
    accessorKey: "work_experience",
    header: "Work Experience",
  },
  {
    accessorKey: "type_of_employment",
    header: "Type of Employment",
  },
]
