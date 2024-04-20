import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const rollupRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        ownerId: z.string().min(1),
        rollupName: z.string().min(1),
        subdomain: z.string().min(1),
        chainId: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        // TODO
        // Send data to backend for rollup deployment

        const { ownerId, rollupName, subdomain, chainId } = input;
        const newRollup = await ctx.db.rollup.create({
          data: {
            ownerId,
            name: rollupName,
            subdomain,
            chainId: parseInt(chainId),
          },
        });

        return { rollup: newRollup };
      } catch (error) {
        console.log(error);
        return { error, errorMsg: "Something went wrong" };
      }
    }),

  getAllFromUser: publicProcedure
    .input(
      z.object({
        ownerId: z.string().min(1),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const userRollups = await ctx.db.rollup.findMany({
          where: { ownerId: input.ownerId },
        });
        if (userRollups) {
          return { rollups: userRollups };
        } else {
          return { rollups: null, message: "No user found" };
        }
      } catch (error) {
        console.log(error);
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
        const rollup = await ctx.db.rollup.findUnique({
          where: { id: parseInt(input.id) },
        });
        if (rollup) {
          return { rollup };
        } else {
          return { rollup: null, message: "No user found" };
        }
      } catch (error) {
        console.log(error);
        return { error, errorMsg: "Something went wrong" };
      }
    }),
});
