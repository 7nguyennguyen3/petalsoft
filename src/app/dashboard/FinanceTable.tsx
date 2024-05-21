import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { db } from "@/db";

const WEEKLY_GOAL = 500;
const MONTHLY_GOAL = 2500;

const FinanceTable = async () => {
  const lastWeekSum = await db.order.aggregate({
    where: {
      isPaid: true,
      createdAt: {
        gte: new Date(new Date().setDate(new Date().getDate() - 7)),
      },
    },
    _sum: {
      total: true,
    },
  });

  const lastMonthSum = await db.order.aggregate({
    where: {
      isPaid: true,
      createdAt: {
        gte: new Date(new Date().setDate(new Date().getDate() - 30)),
      },
    },
    _sum: {
      total: true,
    },
  });

  const yearToDateSum = await db.order.aggregate({
    where: {
      isPaid: true,
      createdAt: {
        gte: new Date(new Date().getFullYear(), 0, 1),
      },
    },
    _sum: {
      total: true,
    },
  });

  return (
    <div className="mb-20">
      <Card className="mb-10">
        <CardHeader className="pb-2">
          <CardDescription>Year-To-Date Revenue</CardDescription>
          <CardTitle className="text-3xl">
            {yearToDateSum._sum.total
              ? `$${yearToDateSum._sum.total.toFixed(2)}`
              : "0.00"}
          </CardTitle>
        </CardHeader>
      </Card>
      <div className="grid xs:grid-cols-1 sm:grid-cols-2 gap-5">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Last Week Revenue</CardDescription>
            <CardTitle className="text-3xl">
              {lastWeekSum._sum.total
                ? `$${lastWeekSum._sum.total.toFixed(2)}`
                : "0.00"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              of ${WEEKLY_GOAL} goal
            </div>
          </CardContent>
          <CardFooter>
            <Progress
              value={((lastWeekSum._sum.total ?? 0) * 100) / WEEKLY_GOAL}
            />
          </CardFooter>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Last Month Revenue</CardDescription>
            <CardTitle className="text-3xl">
              {lastMonthSum._sum.total
                ? `$${lastMonthSum._sum.total.toFixed(2)}`
                : "0.00"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              of ${MONTHLY_GOAL} goal
            </div>
          </CardContent>
          <CardFooter>
            <Progress
              value={((lastMonthSum._sum.total ?? 0) * 100) / MONTHLY_GOAL}
            />
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default FinanceTable;
