import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { Input } from "postcss";

export const userRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        id: z.string().min(1),
        email: z.string().min(1),
        appWallet: z.string().min(1),
        organizationName: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const { id, email, appWallet, organizationName } = input;
        const newUser = await ctx.db.user.create({
          data: {
            id,
            email,
            appWallet,
          },
        });

        const newOrganization = await ctx.db.organization.create({
          data: { name: organizationName, ownerId: newUser.id },
        });

        return { user: newUser, organization: newOrganization };
      } catch (error) {
        return { error, errorMsg: "Something went wrong" };
      }
    }),

  getById: publicProcedure
    .input(
      z.object({
        id: z.string().min(1),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const user = await ctx.db.user.findUnique({
          where: { id: input.id },
          include: {
            organizations: true,
          },
        });
        if (user) {
          return { user };
        } else {
          return { user: null, message: "No user found" };
        }
      } catch (error) {
        return { error, errorMsg: "Something went wrong" };
      }
    }),
});
