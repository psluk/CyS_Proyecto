--------------------------------------------------------------------------
-- Author:       Jasson Segura Jimenez
-- Date:         2024-04-11
-- Description:  Creates a new entrepreneurship post
--------------------------------------------------------------------------
CREATE OR ALTER PROCEDURE [dbo].[EmprendeTEC_SP_SaveProject]
    -- Parameters
	@IN_projectName NVARCHAR(50),
    @IN_description NVARCHAR(255),
    @IN_userEmail NVARCHAR(255),
    @IN_images NVARCHAR(MAX)
AS
BEGIN
    SET NOCOUNT ON;

    -- ERROR HANDLING
    DECLARE @ErrorNumber INT, @ErrorSeverity INT, @ErrorState INT, @Message VARCHAR(200);
    DECLARE @transactionStarted BIT = 0;

    BEGIN TRY
        -- VALIDATIONS
        IF EXISTS
        (
            SELECT  1
            FROM    [dbo].[Posts]
            WHERE   [title] = @IN_projectName
        )
        BEGIN
            RAISERROR('Un proyecto con ese nombre ya existe.', 16, 1);
        END;

        DECLARE @userId INT;
        SELECT @userId = [userId] FROM [dbo].[Users] WHERE [email] = @IN_userEmail;

        -- START TRANSACTION
        IF @@TRANCOUNT = 0
        BEGIN
            SET @transactionStarted = 1;
            BEGIN TRANSACTION;
        END;

        -- Insert the project into the 'posts' table
        INSERT INTO [dbo].[Posts]
        (
            [userId],
            [title],
            [description],
            [rating],
            [timestamp]
        )
        VALUES
        (
            @userId,
            @IN_projectName,
            @IN_description,
            0,
            GETDATE()
        );

        -- Get the ID of the inserted project
		DECLARE @projectId INT;
		SELECT @projectId = [postId] FROM [dbo].[Posts] WHERE [title] = @IN_projectName;
			-- Insert the images into the 'postimages' table

		DECLARE @imageTable TABLE (ImageUrl NVARCHAR(255));
		INSERT INTO @imageTable (ImageUrl)
		SELECT value FROM STRING_SPLIT(@IN_images, ',');

		INSERT INTO [dbo].[postimages]
		(
				[postId],
				[imageUrl]
			)
			SELECT @projectId,  ImageUrl FROM @imageTable;


        -- COMMIT TRANSACTION
        IF @transactionStarted = 1
        BEGIN
            COMMIT TRANSACTION;
        END;

    END TRY
    BEGIN CATCH
        SET @ErrorNumber = ERROR_NUMBER();
        SET @ErrorSeverity = ERROR_SEVERITY();
        SET @ErrorState = ERROR_STATE();
        SET @Message = ERROR_MESSAGE();

        IF @transactionStarted = 1
        BEGIN
            ROLLBACK;
        END;

        IF @ErrorNumber != 50000
        BEGIN
            -- If it's not a custom error, log the error
            INSERT INTO [dbo].[Errors]
            VALUES
            (
                SUSER_NAME(),
                ERROR_NUMBER(),
                ERROR_STATE(),
                ERROR_SEVERITY(),
                ERROR_LINE(),
                ERROR_PROCEDURE(),
                ERROR_MESSAGE(),
                GETDATE()
            );
        END;

        RAISERROR('%s - Error Number: %i', 
            @ErrorSeverity, @ErrorState, @Message, @ErrorNumber);

    END CATCH;
END;