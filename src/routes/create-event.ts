import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { generateSlug } from "../utils/generate-slug";
import { prisma } from "../lib/prisma";
import { FastifyInstance } from "fastify";


export async function createEventRoute(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .post('/events', {
      schema: {
          body: z.object({
          title: z.string().min(5),
          details: z.string().nullable(),
          maximumAttendees: z.number().int().positive().nullable(),
        }),
        response: {
          201: z.object({
            eventId: z.string().uuid(),
          }),
        },
      },
    }, async (request, reply) => {
      const createEventSchema = z.object({
        title: z.string().min(5),
        details: z.string().nullable(),
        maximumAttendees: z.number().int().positive().nullable(),
      });

      const {
        title,
        details,
        maximumAttendees,
      } = createEventSchema.parse(request.body);

      const slug = generateSlug(title);

      const eventWithSameSlug = await prisma.event.findFirst({
        where: {
          slug,
        }
      });

      if (eventWithSameSlug !== null) {
        throw new Error("An event with the same title already exists.")
      }

      const event = await prisma.event.create({
        data: {
          title,
          details,
          maximumAttendees,
          slug,
        }
      });

      return reply.status(201).send({ eventId: event.id });
    })
}