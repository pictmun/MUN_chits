import { Loading } from "../../components/Loading";
import { useGetAllChitMarks } from "../../hooks/useGetAllChitMarks";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";


const MarksPage = () => {
  const { chitMarks, loading } = useGetAllChitMarks();
  if(loading){
    return <Loading classes="w-full h-full"/>
  }

  return (
    <div className="w-full p-5">
      <h2 className="text-2xl md:text-3xl mb-1 font-semibold">
        Delegate Scores
      </h2>
      <p className="text-muted-foreground text-sm mb-5">
        There are {chitMarks?.length} delegates in the commitee.
      </p>

      <Table>
        <TableHeader className="bg-primary-foreground text-lg">
          <TableRow>
            <TableHead>Portfolio</TableHead>
            <TableHead >Number of Chits</TableHead>
            <TableHead>Score</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {chitMarks?.map((chitMark: any) => (
            <TableRow key={chitMark.delegateId} className="py-2">
              <TableCell  className="text-base ">{chitMark.portfolio}</TableCell>
              <TableCell className="text-base">{chitMark.totalMessages}</TableCell>
              <TableCell className="text-base px-3">{chitMark.totalScore}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default MarksPage;
