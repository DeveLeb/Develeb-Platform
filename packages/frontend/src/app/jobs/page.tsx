import PaginationControls from '@/components/atoms/PaginationControls';
import JobSearchPanel from '@/components/molecules/JobSearchPanel';
import JobsList from '@/components/molecules/JobsList';
import { Job, columns } from './columns';
import { DataTable } from './data-table';

// const JobPage = () => {
//   return (
//     <div>
//       {/* <JobSearchPanel />
//       <JobsList />
//       <PaginationControls /> */}
//     </div>
//   );
// };
// export default JobPage;
async function getData(): Promise<Job[]> {
  // Fetch data from your API here.
  return [
    {
      id: "728ed52f",
      salary: ">100k",
      location: "remote",
      work_experience: "any",
      type_of_employment: "tempo",
      date_of_posting: "All time",

    },
    // ...
  ]
}
 
export default async function DemoPage() {
  const data = await getData()
 
  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
  )
}