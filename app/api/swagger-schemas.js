/**
 * @swagger
 * components:
 *   schemas:
 *     Workspace:
 *       type: object
 *       properties:
 *         workspace_id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: "string"
 *         created_at:
 *           type: string
 *           format: date-time
 *           example: "2024-01-01T00:00:00Z"
 *         members:
 *           type: string
 *           example: "string"
 *         channels:
 *           type: string
 *           example: "string"
 *         invites:
 *           type: string
 *           example: "string"
 *     WorkspaceMember:
 *       type: object
 *       properties:
 *         workspace_member_id:
 *           type: integer
 *           example: 1
 *         workspace_id:
 *           type: integer
 *           example: 1
 *         user_id:
 *           type: integer
 *           example: 1
 *         role:
 *           type: string
 *           example: "string"
 *         joined_at:
 *           type: string
 *           format: date-time
 *           example: "2024-01-01T00:00:00Z"
 *         workspace:
 *           type: string
 *           example: "string"
 *         user:
 *           type: string
 *           example: "string"
 *     WorkspaceInvite:
 *       type: object
 *       properties:
 *         invite_id:
 *           type: integer
 *           example: 1
 *         workspace_id:
 *           type: integer
 *           example: 1
 *         inviter_id:
 *           type: integer
 *           example: 1
 *         invitee_email:
 *           type: string
 *           example: "string"
 *         role:
 *           type: string
 *           example: "string"
 *         status:
 *           type: string
 *           example: "string"
 *         created_at:
 *           type: string
 *           format: date-time
 *           example: "2024-01-01T00:00:00Z"
 *         workspace:
 *           type: string
 *           example: "string"
 *         inviter:
 *           type: string
 *           example: "string"
 *     User:
 *       type: object
 *       properties:
 *         user_id:
 *           type: integer
 *           example: 1
 *         username:
 *           type: string
 *           example: "string"
 *         email:
 *           type: string
 *           example: "string"
 *         password:
 *           type: string
 *           example: "string"
 *         role:
 *           type: string
 *           example: "string"
 *         profile_image:
 *           type: string
 *           example: "string"
 *         online_status:
 *           type: string
 *           example: "string"
 *         current_workspace_id:
 *           type: integer
 *           example: 1
 *         emailVerified:
 *           type: string
 *           format: date-time
 *           example: "2024-01-01T00:00:00Z"
 *         verificationToken:
 *           type: string
 *           example: "string"
 *         tokenExpiry:
 *           type: string
 *           format: date-time
 *           example: "2024-01-01T00:00:00Z"
 *         website:
 *           type: string
 *           example: "string"
 *         company:
 *           type: string
 *           example: "string"
 *         country:
 *           type: string
 *           example: "string"
 *         phone:
 *           type: string
 *           example: "string"
 *         company_size:
 *           type: string
 *           example: "string"
 *         created_at:
 *           type: string
 *           format: date-time
 *           example: "2024-01-01T00:00:00Z"
 *         is_setup:
 *           type: boolean
 *           example: true
 *         workspaces:
 *           type: string
 *           example: "string"
 *         sent_invites:
 *           type: string
 *           example: "string"
 *         teams:
 *           type: string
 *           example: "string"
 *         assignments:
 *           type: string
 *           example: "string"
 *         notes:
 *           type: string
 *           example: "string"
 *         activity_logs:
 *           type: string
 *           example: "string"
 *         chat_sessions:
 *           type: string
 *           example: "string"
 *     Team:
 *       type: object
 *       properties:
 *         team_id:
 *           type: integer
 *           example: 1
 *         team_name:
 *           type: string
 *           example: "string"
 *         description:
 *           type: string
 *           example: "string"
 *         platforms:
 *           type: object
 *           example: {}
 *         members:
 *           type: string
 *           example: "string"
 *     TeamMember:
 *       type: object
 *       properties:
 *         team_member_id:
 *           type: integer
 *           example: 1
 *         team_id:
 *           type: integer
 *           example: 1
 *         user_id:
 *           type: integer
 *           example: 1
 *         team:
 *           type: string
 *           example: "string"
 *         user:
 *           type: string
 *           example: "string"
 *     Channel:
 *       type: object
 *       properties:
 *         channel_id:
 *           type: integer
 *           example: 1
 *         workspace_id:
 *           type: integer
 *           example: 1
 *         workspace:
 *           type: string
 *           example: "string"
 *         name:
 *           type: string
 *           example: "string"
 *         platform_name:
 *           type: string
 *           example: "string"
 *         fb_page_id:
 *           type: string
 *           example: "string"
 *         fb_page_access_token:
 *           type: string
 *           example: "string"
 *         line_channel_id:
 *           type: string
 *           example: "string"
 *         line_channel_secret:
 *           type: string
 *           example: "string"
 *         line_access_token:
 *           type: string
 *           example: "string"
 *         telegram_bot_token:
 *           type: string
 *           example: "string"
 *         status:
 *           type: string
 *           example: "string"
 *         created_at:
 *           type: string
 *           format: date-time
 *           example: "2024-01-01T00:00:00Z"
 *         updated_at:
 *           type: string
 *           format: date-time
 *           example: "2024-01-01T00:00:00Z"
 *         chat_sessions:
 *           type: string
 *           example: "string"
 *         social_accounts:
 *           type: string
 *           example: "string"
 *     Customer:
 *       type: object
 *       properties:
 *         customer_id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: "string"
 *         image:
 *           type: string
 *           example: "string"
 *         email:
 *           type: string
 *           example: "string"
 *         phone:
 *           type: string
 *           example: "string"
 *         company:
 *           type: string
 *           example: "string"
 *         country:
 *           type: string
 *           example: "string"
 *         created_at:
 *           type: string
 *           format: date-time
 *           example: "2024-01-01T00:00:00Z"
 *         social_accounts:
 *           type: string
 *           example: "string"
 *         chat_sessions:
 *           type: string
 *           example: "string"
 *         tags:
 *           type: string
 *           example: "string"
 *     CustomerSocialAccount:
 *       type: object
 *       properties:
 *         social_account_id:
 *           type: integer
 *           example: 1
 *         customer_id:
 *           type: integer
 *           example: 1
 *         channel_id:
 *           type: integer
 *           example: 1
 *         account_identifier:
 *           type: string
 *           example: "string"
 *         customer:
 *           type: string
 *           example: "string"
 *         channel:
 *           type: string
 *           example: "string"
 *     AiAgent:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: "string"
 *         emoji:
 *           type: string
 *           example: "string"
 *         greeting:
 *           type: string
 *           example: "string"
 *         instructions:
 *           type: string
 *           example: "string"
 *         tone:
 *           type: string
 *           example: "string"
 *         guardrails:
 *           type: string
 *           example: "string"
 *         lead_gen:
 *           type: object
 *           example: {}
 *         handover:
 *           type: object
 *           example: {}
 *         is_published:
 *           type: boolean
 *           example: true
 *         created_at:
 *           type: string
 *           format: date-time
 *           example: "2024-01-01T00:00:00Z"
 *         updated_at:
 *           type: string
 *           format: date-time
 *           example: "2024-01-01T00:00:00Z"
 *     AiPrompt:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: "string"
 *         action:
 *           type: string
 *           example: "string"
 *         active:
 *           type: boolean
 *           example: true
 *         isDefault:
 *           type: boolean
 *           example: true
 *         created_at:
 *           type: string
 *           format: date-time
 *           example: "2024-01-01T00:00:00Z"
 *     ChatSession:
 *       type: object
 *       properties:
 *         chat_session_id:
 *           type: integer
 *           example: 1
 *         customer_id:
 *           type: integer
 *           example: 1
 *         channel_id:
 *           type: integer
 *           example: 1
 *         assigned_user_id:
 *           type: integer
 *           example: 1
 *         ai_agent_id:
 *           type: integer
 *           example: 1
 *         board_column_id:
 *           type: string
 *           example: "string"
 *         board_column:
 *           type: string
 *           example: "string"
 *         status:
 *           type: string
 *           example: "string"
 *         start_time:
 *           type: string
 *           format: date-time
 *           example: "2024-01-01T00:00:00Z"
 *         end_time:
 *           type: string
 *           format: date-time
 *           example: "2024-01-01T00:00:00Z"
 *         customer:
 *           type: string
 *           example: "string"
 *         channel:
 *           type: string
 *           example: "string"
 *         assigned_user:
 *           type: string
 *           example: "string"
 *         messages:
 *           type: string
 *           example: "string"
 *         notes:
 *           type: string
 *           example: "string"
 *         assignments:
 *           type: string
 *           example: "string"
 *         tags:
 *           type: string
 *           example: "string"
 *         logs:
 *           type: string
 *           example: "string"
 *     Message:
 *       type: object
 *       properties:
 *         message_id:
 *           type: integer
 *           example: 1
 *         chat_session_id:
 *           type: integer
 *           example: 1
 *         sender_type:
 *           type: string
 *           example: "string"
 *         sender_id:
 *           type: integer
 *           example: 1
 *         message_type:
 *           type: string
 *           example: "string"
 *         content:
 *           type: string
 *           example: "string"
 *         external_id:
 *           type: string
 *           example: "string"
 *         is_read:
 *           type: boolean
 *           example: true
 *         attachment_url:
 *           type: string
 *           example: "string"
 *         created_at:
 *           type: string
 *           format: date-time
 *           example: "2024-01-01T00:00:00Z"
 *         read_at:
 *           type: string
 *           format: date-time
 *           example: "2024-01-01T00:00:00Z"
 *         chat_session:
 *           type: string
 *           example: "string"
 *     BoardColumn:
 *       type: object
 *       properties:
 *         column_id:
 *           type: string
 *           example: "string"
 *         title:
 *           type: string
 *           example: "string"
 *         order_index:
 *           type: integer
 *           example: 1
 *         created_at:
 *           type: string
 *           format: date-time
 *           example: "2024-01-01T00:00:00Z"
 *         chat_sessions:
 *           type: string
 *           example: "string"
 *     Note:
 *       type: object
 *       properties:
 *         note_id:
 *           type: integer
 *           example: 1
 *         chat_session_id:
 *           type: integer
 *           example: 1
 *         user_id:
 *           type: integer
 *           example: 1
 *         title:
 *           type: string
 *           example: "string"
 *         content:
 *           type: string
 *           example: "string"
 *         created_at:
 *           type: string
 *           format: date-time
 *           example: "2024-01-01T00:00:00Z"
 *         is_deleted:
 *           type: boolean
 *           example: true
 *         chat_session:
 *           type: string
 *           example: "string"
 *         user:
 *           type: string
 *           example: "string"
 *     Assignment:
 *       type: object
 *       properties:
 *         assignment_id:
 *           type: integer
 *           example: 1
 *         chat_session_id:
 *           type: integer
 *           example: 1
 *         user_id:
 *           type: integer
 *           example: 1
 *         topic:
 *           type: string
 *           example: "string"
 *         detail:
 *           type: string
 *           example: "string"
 *         deadline:
 *           type: string
 *           format: date-time
 *           example: "2024-01-01T00:00:00Z"
 *         status:
 *           type: string
 *           example: "string"
 *         chat_session:
 *           type: string
 *           example: "string"
 *         user:
 *           type: string
 *           example: "string"
 *     Tag:
 *       type: object
 *       properties:
 *         tag_id:
 *           type: integer
 *           example: 1
 *         tag_name:
 *           type: string
 *           example: "string"
 *         color:
 *           type: string
 *           example: "string"
 *         description:
 *           type: string
 *           example: "string"
 *         customers:
 *           type: string
 *           example: "string"
 *         chats:
 *           type: string
 *           example: "string"
 *     CustomerTag:
 *       type: object
 *       properties:
 *         customer_tag_id:
 *           type: integer
 *           example: 1
 *         customer_id:
 *           type: integer
 *           example: 1
 *         tag_id:
 *           type: integer
 *           example: 1
 *         customer:
 *           type: string
 *           example: "string"
 *         tag:
 *           type: string
 *           example: "string"
 *     ChatTag:
 *       type: object
 *       properties:
 *         chat_tag_id:
 *           type: integer
 *           example: 1
 *         chat_session_id:
 *           type: integer
 *           example: 1
 *         tag_id:
 *           type: integer
 *           example: 1
 *         chat:
 *           type: string
 *           example: "string"
 *         tag:
 *           type: string
 *           example: "string"
 *     ActivityLog:
 *       type: object
 *       properties:
 *         log_id:
 *           type: integer
 *           example: 1
 *         user_id:
 *           type: integer
 *           example: 1
 *         chat_session_id:
 *           type: integer
 *           example: 1
 *         action:
 *           type: string
 *           example: "string"
 *         old_value:
 *           type: string
 *           example: "string"
 *         new_value:
 *           type: string
 *           example: "string"
 *         created_at:
 *           type: string
 *           format: date-time
 *           example: "2024-01-01T00:00:00Z"
 *         user:
 *           type: string
 *           example: "string"
 *         chat:
 *           type: string
 *           example: "string"
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           example: "Internal Server Error"
 */
export const swaggerSchemas = "This file contains global swagger schemas";
