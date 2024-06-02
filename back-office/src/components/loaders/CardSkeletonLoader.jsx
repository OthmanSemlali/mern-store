import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
} from "@material-tailwind/react";

const CardSkeletonLoader = () => {
  return (
    <Card className="border shadow-sm border-blue-gray-100 animate-pulse">
     
     <div className="grid grid-flow-col">

        <CardHeader
          variant="gradient"
          color="blue-gray"
          floated={false}
          shadow={false}
          className="grid h-12 bg-blue-gray-200"
        >
          {/* <div className="w-6 h-6 rounded-full bg-blue-gray-300"></div> */}
        </CardHeader>
        <CardBody className="p-4 text-right ">
          <div className="w-20 h-4 mb-2 rounded-md bg-blue-gray-200"></div>
          <div className="w-3/4 h-8 rounded-md bg-blue-gray-200"></div>
        </CardBody>
        </div>


      <CardFooter className="p-4 border-t border-blue-gray-50">
        <div className="w-full h-4 rounded-md bg-blue-gray-200"></div>
      </CardFooter>
    </Card>
  );
};

export default CardSkeletonLoader;
