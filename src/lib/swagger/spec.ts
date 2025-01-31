import { authLoginPaths } from "@/app/api/v1/auth/login/docs";
import { authLogoutPaths } from "@/app/api/v1/auth/logout/docs";
import { authRegisterPaths } from "@/app/api/v1/auth/register/docs";
import { chatsPaths } from "@/app/api/v1/chats/docs";
import { chatMessagesFromUserIdPaths } from "@/app/api/v1/chats/messages/from/[user_id]/docs";
import { chatMessagesToUserIdPaths } from "@/app/api/v1/chats/messages/to/[user_id]/docs";
import { chatMessagesByRoomIdPaths } from "@/app/api/v1/chats/rooms/[room_id]/messages/docs";
import { readChatByRoomIdPaths } from "@/app/api/v1/chats/rooms/[room_id]/read/docs";
import { chatRoomsPaths } from "@/app/api/v1/chats/rooms/docs";
import { examplePaths } from "@/app/api/v1/example/docs";
import { jobByIdPaths } from "@/app/api/v1/jobs/[job_id]/docs";
import { jobsPaths } from "@/app/api/v1/jobs/docs";
import { multiJobApplicationApprovalByIdPaths } from "@/app/api/v1/jobs/multi/[job_id]/applications/[application_id]/approval/docs";
import { multiJobApplicationByIdPaths } from "@/app/api/v1/jobs/multi/[job_id]/applications/docs";
import { multiJobByIdPaths } from "@/app/api/v1/jobs/multi/[job_id]/docs";
import { multiJobPaths } from "@/app/api/v1/jobs/multi/docs";
import { approveJobByIdPaths } from "@/app/api/v1/jobs/single/[job_id]/applicants/[applicant_id]/approve/docs";
import { approvalSingleJobApplicationByIdPaths } from "@/app/api/v1/jobs/single/[job_id]/applications/[application_id]/approval/docs";
import { applicationBySingleJobIdPaths } from "@/app/api/v1/jobs/single/[job_id]/applications/docs";
import { applyJobByIdPaths } from "@/app/api/v1/jobs/single/[job_id]/apply/docs";
import { singleJobByIdPaths } from "@/app/api/v1/jobs/single/[job_id]/docs";
import { singleJobPaths } from "@/app/api/v1/jobs/single/docs";
import { applyOfferByIdPaths } from "@/app/api/v1/offers/[offer_id]/apply/docs";
// import { acceptanceOffersByIdPaths } from "@/app/api/v1/offers/[offer_id]/requests/[request_id]/acceptence/docs";
import { offers2Paths } from "@/app/api/v1/offers/docs";
import { swaggerComponents } from "./component";
import { swaggerSecuritySchemes } from "./security";
import { applicantsOfferPaths } from "@/app/api/v1/offers/[offer_id]/applicants/docs";
import { detailOfferPaths } from "@/app/api/v1/offers/[offer_id]/docs";
import { accountPaths } from "@/app/api/v1/accounts/docs";

export const swaggerSpec = {
  openapi: "3.1.0",
  info: { title: "Unitip API Documentation", version: "1.0" },
  components: {
    securitySchemes: swaggerSecuritySchemes,
    schemas: swaggerComponents,
  },
  paths: {
    // auth
    ...authLoginPaths,
    ...authLogoutPaths,
    ...authRegisterPaths,

    // account
    ...accountPaths,

    // jobs
    ...jobsPaths,
    ...jobByIdPaths,
    ...singleJobPaths,
    ...singleJobByIdPaths,
    ...applyJobByIdPaths,
    ...approveJobByIdPaths,

    // - single jobs
    ...applicationBySingleJobIdPaths,
    ...approvalSingleJobApplicationByIdPaths,

    // - multi jobs
    ...multiJobPaths,
    ...multiJobByIdPaths,
    ...multiJobApplicationByIdPaths,
    ...multiJobApplicationApprovalByIdPaths,

    //offers
    // ...offersPaths,
    ...offers2Paths,
    ...detailOfferPaths,
    // ...singleOffersPaths,
    // ...multiOffersPaths,
    // ...applyOfferByIdPaths,
    // ...applyMultiOfferByIdPaths,
    ...applyOfferByIdPaths,
    ...applicantsOfferPaths,
    // ...acceptanceOffersByIdPaths,

    // example
    ...examplePaths,

    // chats
    ...chatsPaths,
    ...chatRoomsPaths,
    ...chatMessagesByRoomIdPaths,
    ...readChatByRoomIdPaths,
    ...chatMessagesFromUserIdPaths,
    ...chatMessagesToUserIdPaths,
  },
};
